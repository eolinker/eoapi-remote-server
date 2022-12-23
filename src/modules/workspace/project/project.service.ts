import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { DeepPartial, In, Like, Repository } from 'typeorm';
import { ApiGroupService } from '../apiGroup/apiGroup.service';
import { ApiDataService } from '../apiData/apiData.service';
import { EnvironmentService } from '../environment/environment.service';
import { CreateDto } from './dto/create.dto';
import { SetRoleDto, UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { Child, Environment, ImportDto, ImportResult } from './dto/import.dto';
import { parseAndCheckApiData, parseAndCheckEnv } from './validate';
import { Project } from '@/entities/project.entity';
import { WorkspaceEntity } from '@/entities/workspace.entity';
import {
  WorkspaceMemberAddDto,
  WorkspaceMemberRemoveDto,
  WorkspaceUser,
} from '@/modules/workspace/workspace.dto';
import { ProjectUserRoleEntity } from '@/entities/project-user-role.entity';
import { RoleEnum } from '@/enums/role.enum';
import { RoleEntity } from '@/entities/role.entity';
import { PermissionEntity } from '@/entities/permission.entity';
import { RolePermissionEntity } from '@/entities/role-permission.entity';
import { WorkspaceUserRoleEntity } from '@/entities/workspace-user-role.entity';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class ProjectService implements OnModuleInit {
  private userService: UserService;
  constructor(
    private moduleRef: ModuleRef,
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(ProjectUserRoleEntity)
    private readonly projectUserRoleRepo: Repository<ProjectUserRoleEntity>,
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private rolePermissionRepo: Repository<RolePermissionEntity>,
    @InjectRepository(WorkspaceUserRoleEntity)
    private workspaceUserRoleRepo: Repository<WorkspaceUserRoleEntity>,
    private readonly apiDataService: ApiDataService,
    private readonly apiGroupService: ApiGroupService,
    private readonly environmentService: EnvironmentService,
  ) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, { strict: false });
  }

  async memberAdd(projectID: number, addMemberDto: WorkspaceMemberAddDto) {
    return addMemberDto.userIDs.map((userID) => {
      return this.projectUserRoleRepo.save({
        projectID,
        userID,
        roleID: RoleEnum.ProjectEditorRoleID,
      });
    });
  }

  async memberRemove(
    projectID: number,
    createCatDto: WorkspaceMemberRemoveDto,
  ) {
    return this.projectUserRoleRepo.delete({
      projectID,
      userID: In(createCatDto.userIDs),
    });
  }

  async memberLeave(userID: number, projectID: number) {
    return this.projectUserRoleRepo.delete({
      projectID,
      userID,
    });
  }

  async getMemberList(
    projectID: number,
    username = '',
  ): Promise<WorkspaceUser[]> {
    const userRoles = await this.projectUserRoleRepo.find({
      where: { projectID },
    });
    console.log('userRoles', userRoles, projectID);
    const users = await this.userService.find({
      where: {
        id: In(userRoles.map((n) => n.userID)),
        username: Like(`%${username}%`),
      },
    });

    for (const item of users) {
      const userRole = await this.projectUserRoleRepo.findOneBy({
        userID: item.id,
        projectID,
      });
      const role = await this.roleRepo.findOneBy({ id: userRole.roleID });
      Reflect.set(item, 'role', role);
    }

    return (users as WorkspaceUser[]).sort((a, b) => a.role.id - b.role.id);
  }

  async setProjectRole(projectID: number, dto: SetRoleDto) {
    const projectUserRole = await this.projectUserRoleRepo.findOneBy({
      projectID,
      userID: dto.memberID,
    });
    projectUserRole.roleID = dto.roleID;

    return this.projectUserRoleRepo.save(projectUserRole);
  }

  async getRolePermission(
    userID: number,
    projectID: number,
    workspaceID: number,
  ) {
    const isWorkspaceOwner = await this.workspaceUserRoleRepo.findOneBy({
      userID,
      workspaceID,
    });

    // 如果是空间 owner，那么直接将项目 owner 的权限返回
    if (isWorkspaceOwner) {
      const rolePerm = await this.rolePermissionRepo.findBy({
        roleID: RoleEnum.ProjectOwnerRoleID,
      });
      const permissions = await this.permissionRepo.findBy({
        id: In(rolePerm.map((n) => n.permissionID)),
      });

      return {
        permissions: permissions.map((n) => n.name),
        role: await this.roleRepo.findOneBy({
          id: RoleEnum.ProjectOwnerRoleID,
        }),
      };
    }

    const userRole = await this.projectUserRoleRepo.findOneBy({
      userID,
      projectID,
    });
    if (!userRole) {
      throw new NotFoundException('获取失败！你不在该项目里');
    }
    const role = await this.roleRepo.findOneBy({ id: userRole.roleID });
    const rolePerm = await this.rolePermissionRepo.findBy({
      roleID: userRole.roleID,
    });
    const permissions = await this.permissionRepo.findBy({
      id: In(rolePerm.map((n) => n.permissionID)),
    });

    return {
      permissions: permissions.map((n) => n.name),
      role,
    };
  }

  async hasProjectAuth(workspaceID: number, projectID: number, userID: number) {
    const isWorkspaceOwner = await this.workspaceUserRoleRepo.findOneBy({
      userID,
      workspaceID,
    });
    return (
      isWorkspaceOwner ||
      this.projectUserRoleRepo.findOneBy({
        projectID,
        userID,
      })
    );
  }

  async create(createDto: CreateDto, workspaceID: number, userID: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: {
        id: workspaceID,
      },
      relations: {
        users: true,
      },
    });
    const project = await this.repository.save({
      ...createDto,
      workspace,
      users: workspace.users,
    });

    this.projectUserRoleRepo.save({
      userID,
      projectID: project.uuid,
      roleID: RoleEnum.ProjectOwnerRoleID,
    });

    return project;
  }

  async save(project: DeepPartial<Project>) {
    return await this.repository.save(project);
  }

  async batchCreate(createDto: Array<CreateDto>) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(Project)
      .values(createDto)
      .execute();
  }

  async findAll(query: QueryDto, workspaceID: number) {
    return await this.repository.find({
      where: {
        ...query,
        workspace: { id: workspaceID },
      },
    });
  }

  async findOneBy(uuid: number): Promise<Project> {
    return await this.repository.findOneBy({
      uuid: Number(uuid),
    });
  }

  async findOne(workspaceID: number, uuid: number): Promise<Project> {
    return await this.repository.findOne({
      where: { uuid: Number(uuid), workspace: { id: workspaceID } },
    });
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }

  async import(workspaceID: number, uuid: number, importDto: ImportDto) {
    importDto.groupID ??= 0;
    const group = this.apiGroupService.findOne({
      where: { uuid: importDto.groupID },
    });
    if (!group) {
      return `导入失败，id为${importDto.groupID}的分组不存在`;
    }
    const project = await this.findOne(workspaceID, uuid);
    if (project) {
      const { collections, enviroments } = importDto;
      const data = {
        errors: {
          apiData: [],
          group: [],
          enviroments: [],
        },
        successes: {
          apiData: [],
          group: [],
          enviroments: [],
        },
      };
      this.importEnv(enviroments, uuid, data);
      return this.importCollects(collections, uuid, importDto.groupID, data);
    }
    return '导入失败，项目不存在';
  }

  exportCollects(apiGroup: any[], apiData: any[], parentID = 0) {
    const apiGroupFilters = apiGroup.filter(
      (child) => child.parentID === parentID,
    );
    const apiDataFilters = apiData.filter(
      (child) => child.groupID === parentID,
    );
    return apiGroupFilters
      .map((item) => {
        return {
          name: item.name,
          children: this.exportCollects(apiGroup, apiData, item.uuid),
        };
      })
      .concat(apiDataFilters);
  }

  async exportCollections(workspaceID: number, uuid: number) {
    const project = await this.findOne(workspaceID, uuid);
    if (project) {
      const apiData = await this.apiDataService.findAll({ projectID: uuid });
      const apiGroup = await this.apiGroupService.findAll({ projectID: uuid });
      const enviroments = await this.environmentService.findAll({
        where: {
          projectID: uuid,
        },
      });
      return {
        collections: this.exportCollects(apiGroup, apiData),
        enviroments,
      };
    }
    return '导出失败，项目不存在';
  }

  async importEnv(
    enviroments: Environment[] = [],
    projectID: number,
    importResult: ImportResult,
  ) {
    const promiseTask = enviroments.map(async (item) => {
      const env = {
        ...item,
        parameters: item.parameters as unknown as string,
      };
      const result = parseAndCheckEnv(env);
      if (!result.validate) {
        importResult.errors.enviroments.push(result);
      } else {
        result.data.projectID = projectID;
        const env = await this.environmentService.create(result.data);
        importResult.successes.enviroments.push({
          name: env.name,
          uuid: env.uuid,
        });
      }
    });
    await Promise.allSettled(promiseTask);
  }

  getJSONString(target: any) {
    try {
      if (typeof target === 'object') {
        return target;
      } else if (typeof JSON.parse(target) === 'object') {
        return JSON.parse(target);
      } else {
        return JSON.stringify(target);
      }
    } catch (error) {
      return JSON.stringify(target);
    }
  }

  async importCollects(
    collections: Child[],
    projectID: number,
    parentID = 0,
    importResult: ImportResult,
  ): Promise<ImportResult> {
    return collections.reduce(async (prev: any, curr: any) => {
      Reflect.deleteProperty(curr, 'uuid');
      if (curr.uri || curr.method || curr.protocol) {
        const result = parseAndCheckApiData(curr);
        if (!result.validate) {
          (await prev).apiData.push(curr.name || curr.uri);
        } else {
          const apiData = await this.apiDataService.create({
            ...curr,
            requestBody: this.getJSONString(curr.requestBody || []),
            responseBody: this.getJSONString(curr.responseBody || []),
            projectID,
            groupID: parentID,
          });
          importResult.successes.apiData.push({
            uri: apiData.uri,
            name: apiData.name,
            uuid: apiData.uuid,
          });
        }
      } else {
        if (!curr.name) {
          delete curr.children;
          (await prev).group.push(curr);
        } else {
          const group = await this.apiGroupService.create({
            ...curr,
            projectID,
            parentID,
          });
          importResult.successes.group.push({
            name: group.name,
            uuid: group.uuid,
          });
          if (Array.isArray(curr.children) && curr.children.length) {
            await this.importCollects(
              curr.children,
              projectID,
              group.uuid,
              importResult,
            );
          }
        }
      }
      return prev;
    }, importResult);
  }

  async getProjectCollections(projectID: number) {
    const groups = await this.apiGroupService.findAll({ projectID });
    const apis = await this.apiDataService.findAll({ projectID });

    return {
      groups,
      apis,
    };
  }

  async projectExport(projectID: number) {
    return {
      environment: await this.environmentService.findAll({
        where: { projectID },
      }),
      group: await this.apiGroupService.findAll({ projectID }),
      project: await this.repository.findOne({ where: { uuid: projectID } }),
      apiData: await this.apiDataService.findAll({ projectID }),
    };
  }
}

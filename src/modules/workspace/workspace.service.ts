import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { uniqBy } from 'lodash';
import { DeleteResult, FindOneOptions, In, Like, Repository } from 'typeorm';
import {
  CreateWorkspaceDto,
  SetRoleDto,
  UpdateWorkspaceDto,
  WorkspaceUser,
} from './workspace.dto';
import { PermissionEntity } from '@/entities/permission.entity';
import { WorkspaceEntity } from '@/entities/workspace.entity';
import { UserService } from '@/modules/user/user.service';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { Project } from '@/entities/project.entity';
import { CreateDto as ProjectCreateDto } from '@/modules/workspace/project/dto/create.dto';
import { WorkspaceUserRoleEntity } from '@/entities/workspace-user-role.entity';
import { RoleEnum } from '@/enums/role.enum';
import { RoleEntity } from '@/entities/role.entity';
import { RolePermissionEntity } from '@/entities/role-permission.entity';

@Injectable()
export class WorkspaceService implements OnModuleInit {
  private userService: UserService;
  constructor(
    private moduleRef: ModuleRef,
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(WorkspaceUserRoleEntity)
    private workspaceUserRoleRepo: Repository<WorkspaceUserRoleEntity>,
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private rolePermissionRepo: Repository<RolePermissionEntity>,
    private projectService: ProjectService,
  ) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, { strict: false });
  }

  findOne(options: FindOneOptions<WorkspaceEntity>) {
    return this.workspaceRepository.findOne(options);
  }

  async create(
    creatorID: number,
    createWorkspaceDto: CreateWorkspaceDto,
    project?: ProjectCreateDto & Project,
  ): Promise<WorkspaceEntity> {
    const creator = await this.userService.findOne({
      where: {
        id: creatorID,
      },
      relations: {
        projects: true,
      },
    });

    project ??= await this.projectService.save({
      name: 'My project',
      description: createWorkspaceDto.title + 'My project',
    });

    creator.projects = (creator?.projects || []).concat(project);

    const workspace = await this.workspaceRepository.save({
      ...createWorkspaceDto,
      creatorID,
      users: [await this.userService.updateUser(creator)],
      projects: [project],
    });
    this.workspaceUserRoleRepo.save({
      workspaceID: workspace.id,
      userID: creator.id,
      roleID: RoleEnum.WorkspaceOwnerRoleID,
    });
    return workspace;
  }

  async update(
    id: number,
    updateDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    await this.workspaceRepository.update(id, { title: updateDto.title });
    return this.workspaceRepository.findOneBy({ id });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.workspaceRepository.delete(id);
  }

  list(userId: number): Promise<WorkspaceEntity[]> {
    return this.workspaceRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
    });
  }

  async getMemberList(
    workspaceId: number,
    username = '',
  ): Promise<WorkspaceUser[]> {
    const [result] = await this.userService.findAndCount({
      where: {
        workspaces: {
          id: workspaceId,
        },
        username: Like(`%${username}%`),
      },
    });

    for (const item of result) {
      const userRole = await this.workspaceUserRoleRepo.findOneBy({
        userID: item.id,
        workspaceID: workspaceId,
      });
      const role = await this.roleRepo.findOneBy({ id: userRole.roleID });
      Reflect.set(item, 'role', role);
    }

    return result as WorkspaceUser[];
  }

  async addMembers(workspaceId: number, userIDs: number[]) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: {
        users: true,
        projects: true,
      },
    });
    const users = await this.userService.find({
      where: { id: In(userIDs) },
      relations: {
        workspaces: true,
        projects: true,
      },
    });
    users.forEach((user) => {
      // user.workspaces.push({
      //   ...workspace,
      //   users: [],
      // });
      this.workspaceUserRoleRepo.save({
        userID: user.id,
        roleID: RoleEnum.WorkspaceEditorRoleID,
        workspaceID: workspaceId,
      });
      user.projects = uniqBy([...user.projects, ...workspace.projects], 'uuid');
      this.userService.updateUser(user);
    });
    workspace.users.push(...users);
    return this.workspaceRepository.save(workspace);
  }

  async removeMembers(workspaceId: number, userIDs: number[]) {
    const workspaceUserRoles = await this.workspaceUserRoleRepo.findBy({
      userID: In(userIDs),
    });
    const workspaceUserRoleOwners = await this.workspaceUserRoleRepo.findBy({
      roleID: RoleEnum.WorkspaceOwnerRoleID,
    });
    if (
      workspaceUserRoleOwners.length === 1 &&
      workspaceUserRoles.some((n) => n.roleID === RoleEnum.WorkspaceOwnerRoleID)
    ) {
      throw new BadRequestException('操作失败！至少需要一名空间 owner');
    }
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: {
        users: true,
      },
    });
    workspace.users = workspace.users.filter(
      (user) => !userIDs.includes(user.id),
    );
    this.workspaceUserRoleRepo.delete({ userID: In(userIDs) });
    return this.workspaceRepository.save(workspace);
  }

  async setMemberRole(workspaceID: number, dto: SetRoleDto) {
    const userRole = await this.workspaceUserRoleRepo.findOneBy({
      workspaceID,
      userID: dto.memberID,
    });
    userRole.roleID = dto.roleID;
    return this.workspaceUserRoleRepo.save(userRole);
  }

  async getRolePermission(userID: number, workspaceID: number) {
    const userRole = await this.workspaceUserRoleRepo.findOneBy({
      userID,
      workspaceID,
    });
    if (!userRole) {
      throw new NotFoundException('获取失败！你不在该空间里');
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

  async hasWorkspaceAuth(workspaceID: number, userID: number) {
    return this.workspaceUserRoleRepo.findOneBy({
      workspaceID,
      userID,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ApiGroupService } from '../apiGroup/apiGroup.service';
import { ApiDataService } from '../apiData/apiData.service';
import { EnvironmentService } from '../environment/environment.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { Child, Environment, ImportDto, ImportResult } from './dto/import.dto';
import { parseAndCheckApiData, parseAndCheckEnv } from './validate';
import { Project } from '@/entities/project.entity';
import { WorkspaceEntity } from '@/entities/workspace.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    private readonly apiDataService: ApiDataService,
    private readonly apiGroupService: ApiGroupService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async create(createDto: CreateDto, workspaceID: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: {
        id: workspaceID,
      },
      relations: {
        users: true,
      },
    });
    return await this.repository.save({
      ...createDto,
      workspace,
      users: workspace.users,
    });
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

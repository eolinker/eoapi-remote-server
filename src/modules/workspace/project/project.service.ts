import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiGroupService } from '../apiGroup/apiGroup.service';
import { ApiDataService } from '../apiData/apiData.service';
import { EnvironmentService } from '../environment/environment.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { Child, Collections, Environment, ImportDto } from './dto/import.dto';
import { parseAndCheckApiData, parseAndCheckEnv } from './validate';
import { Project } from '@/entities/project.entity';

type Errors = {
  apiData: any[];
  group: any[];
  enviroments: any[];
};

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
    private readonly apiDataService: ApiDataService,
    private readonly apiGroupService: ApiGroupService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async create(createDto: CreateDto) {
    return await this.repository.save(createDto);
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

  async import(workspaceID: number, uuid: number, importDto: Collections) {
    const project = await this.findOne(workspaceID, uuid);
    if (project) {
      const { collections, enviroments } = importDto;
      const errors = {
        apiData: [],
        group: [],
        enviroments: [],
      };
      this.importEnv(enviroments, uuid, errors);
      return this.importCollects(collections, uuid, 0, errors);
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
    errors: Errors,
  ) {
    enviroments.forEach((item) => {
      const env = {
        ...item,
        projectID,
        parameters: item.parameters as unknown as string,
      };
      const result = parseAndCheckEnv(env);
      if (!result.validate) {
        errors.enviroments.push(item);
      } else {
        this.environmentService.create(env);
      }
    });
  }

  async importCollects(
    collections: Child[],
    projectID: number,
    parentID = 0,
    errors: Errors,
  ): Promise<Errors> {
    return collections.reduce(async (prev: any, curr: any) => {
      Reflect.deleteProperty(curr, 'uuid');
      if (curr.uri || curr.method || curr.protocol) {
        const result = parseAndCheckApiData(curr);
        if (!result.validate) {
          (await prev).apiData.push(curr.name || curr.uri);
        } else {
          await this.apiDataService.create({
            ...curr,
            requestBody: curr.requestBody || [],
            responseBody: curr.responseBody || [],
            projectID,
            groupID: parentID,
          });
        }
      } else {
        if (!curr.name) {
          delete curr.children;
          (await prev).group.push(curr);
        } else {
          const { uuid } = await this.apiGroupService.create({
            ...curr,
            projectID,
            parentID,
          });
          if (Array.isArray(curr.children) && curr.children.length) {
            await this.importCollects(curr.children, projectID, uuid, errors);
          }
        }
      }
      return prev;
    }, errors);
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { Child, Collections, Environment, ImportDto } from './dto/import.dto';
import { ApiGroupService } from '../apiGroup/apiGroup.service';
import { ApiDataService } from '../apiData/apiData.service';
import { parseAndCheckApiData, parseAndCheckEnv } from './validate';
import { EnvironmentService } from '../environment/environment.service';

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

  async findAll(query: QueryDto) {
    return await this.repository.find(query);
  }

  async findOne(id: number): Promise<Project> {
    return await this.repository.findOne(id);
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }

  async import(uuid: number, importDto: Collections) {
    const { collections, enviroments } = importDto;
    const errors = {
      apiData: [],
      group: [],
      enviroments: [],
    };
    this.importEnv(enviroments, uuid, errors);
    return this.importCollects(collections, uuid, 0, errors);
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
}

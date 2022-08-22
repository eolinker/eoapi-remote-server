import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { Child, Collections, ImportDto } from './dto/import.dto';
import { ApiData } from '../../entities/apiData.entity';
import { ApiGroup } from '../../entities/apiGroup.entity';
import { ApiGroupService } from '../apiGroup/apiGroup.service';
import { ApiDataService } from '../apiData/apiData.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
    private readonly apiDataService: ApiDataService,
    private readonly apiGroupService: ApiGroupService,
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
    const { collections } = importDto;
    return this.importCollects(collections, uuid);
  }

  async importCollects(
    collections: Child[],
    projectID: number,
    parentID = 0,
    errors = {
      apiData: [],
      group: [],
    },
  ): Promise<{
    apiData: any[];
    group: any[];
  }> {
    return collections.reduce(async (prev: any, curr: any) => {
      if (curr.uri) {
        await this.apiDataService.create({
          ...curr,
          projectID,
          groupID: parentID,
        });
      } else {
        const { uuid } = await this.apiGroupService.create({
          ...curr,
          projectID,
          parentID,
        });
        if (Array.isArray(curr.children)) {
          await this.importCollects(curr.children, projectID, uuid, errors);
        }
      }
      return prev;
    }, errors);
  }
}

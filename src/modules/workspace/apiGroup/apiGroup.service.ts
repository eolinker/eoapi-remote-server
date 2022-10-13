import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { ApiGroup } from '@/entities/apiGroup.entity';
import { ApiDataService } from '@/modules/workspace/apiData/apiData.service';

@Injectable()
export class ApiGroupService {
  constructor(
    @InjectRepository(ApiGroup)
    private readonly repository: Repository<ApiGroup>,
    private apiDataService: ApiDataService,
  ) {}

  async create(createDto: CreateDto) {
    return await this.repository.save(createDto);
  }

  async batchCreate(createDto: Array<CreateDto>) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(ApiGroup)
      .values(createDto)
      .execute();
  }

  async findAll(query: Partial<QueryDto>) {
    return await this.repository.find({ where: query });
  }

  async findByIds(ids: number[]) {
    return await this.repository.findByIds(ids);
  }
  async findOne(options: FindOneOptions<ApiGroup>): Promise<ApiGroup> {
    return await this.repository.findOne(options);
  }

  async update(id: number, updateDto: UpdateDto) {
    await this.repository.update(id, updateDto);
    return this.repository.findOneBy({ uuid: id });
  }
  async bulkUpdate(updateDto: Array<UpdateDto>) {
    return await this.repository.save(updateDto);
  }
  async remove(ids: number[], projectID: number) {
    const deleteResult = await this.repository
      .createQueryBuilder()
      .delete()
      .from(ApiGroup)
      .where('uuid IN (:...ids)', { ids })
      .andWhere('projectID = :projectID', { projectID })
      .execute();

    this.apiDataService.removeByGroupIDs(ids);
    return deleteResult;
  }
}

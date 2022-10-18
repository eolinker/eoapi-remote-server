import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { ApiTestHistory } from '@/entities/apiTestHistory.entity';

@Injectable()
export class ApiTestHistoryService {
  constructor(
    @InjectRepository(ApiTestHistory)
    private readonly repository: Repository<ApiTestHistory>,
  ) {}

  async create(createDto: CreateDto) {
    createDto.general ??= '{}';
    createDto.apiDataID ??= -1;
    return await this.repository.save(createDto);
  }

  async batchCreate(createDto: Array<CreateDto>) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(ApiTestHistory)
      .values(createDto)
      .execute();
  }

  async findAll(
    query:
      | FindOptionsWhere<ApiTestHistory>
      | FindOptionsWhere<ApiTestHistory>[],
  ) {
    return await this.repository.find({ where: query });
  }

  async findOne(uuid: number, projectID: number): Promise<ApiTestHistory> {
    return await this.repository.findOne({ where: { uuid, projectID } });
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(ids: number[]) {
    return await this.repository.delete(ids);
  }
}

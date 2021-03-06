import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTestHistory } from '../../entities/apiTestHistory.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class ApiTestHistoryService {
  constructor(
    @InjectRepository(ApiTestHistory)
    private readonly repository: Repository<ApiTestHistory>,
  ) {}

  async create(createDto: CreateDto) {
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

  async findAll(query: QueryDto) {
    return await this.repository.find(query);
  }

  async findOne(id: number): Promise<ApiTestHistory> {
    return await this.repository.findOne(id);
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(ids: number[]) {
    return await this.repository.delete(ids);
  }
}

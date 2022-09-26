import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiGroup } from '../../entities/apiGroup.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class ApiGroupService {
  constructor(
    @InjectRepository(ApiGroup)
    private readonly repository: Repository<ApiGroup>,
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

  async findAll(query: QueryDto) {
    return await this.repository.find({ where: query });
  }

  async findByIds(ids: number[]) {
    return await this.repository.findByIds(ids);
  }
  async findOne(uuid: number): Promise<ApiGroup> {
    return await this.repository.findOne({ where: { uuid } });
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }
  async bulkUpdate(updateDto: Array<UpdateDto>) {
    return await this.repository.save(updateDto);
  }
  async remove(id: number) {
    return await this.repository.delete(id);
  }
}

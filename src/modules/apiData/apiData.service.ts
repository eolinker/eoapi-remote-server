import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ApiData } from '../../entities/apiData.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class ApiDataService {
  constructor(
    @InjectRepository(ApiData)
    private readonly repository: Repository<ApiData>,
  ) {}

  async create(createDto: CreateDto) {
    return await this.repository.save(createDto);
  }
  async findByIds(ids: number[]) {
    return await this.repository.findByIds(ids);
  }
  async batchCreate(createDto: Array<CreateDto>) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(ApiData)
      .values(createDto)
      .execute();
  }

  async findAll(query: QueryDto) {
    return await this.repository.find(query);
  }

  async findOne(id: number): Promise<ApiData> {
    return await this.repository.findOne(id);
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }
  async bulkUpdate(updateDto: Array<UpdateDto>){
    return await this.repository.save(updateDto);
  }


  async remove(id: number) {
    return await this.repository.delete(id);
  }
}

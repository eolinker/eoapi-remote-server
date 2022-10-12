import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { MockService } from '../mock/mock.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { ApiData } from '@/entities/apiData.entity';
import { Mock } from '@/entities/mock.entity';

@Injectable()
export class ApiDataService {
  constructor(
    @InjectRepository(ApiData)
    private readonly repository: Repository<ApiData>,
    @InjectRepository(Mock)
    private readonly mockRepository: Repository<Mock>,
    private readonly mockService: MockService,
  ) {}

  async create(createDto: CreateDto) {
    const apiData = await this.repository.save(createDto);
    await this.mockService.create(
      this.mockService.createSystemMockDTO(apiData),
      'system',
    );
    return apiData;
  }
  async findByIds(ids: number[]) {
    return await this.repository.findByIds(ids);
  }
  async batchCreate(createDto: Array<CreateDto>) {
    const result = await this.repository
      .createQueryBuilder()
      .insert()
      .into(ApiData)
      .values(createDto)
      .execute();

    const apiDatas = await this.repository.find({ where: result.identifiers });
    const mockList = apiDatas.map((item) =>
      this.mockService.createSystemMockDTO(item),
    );
    this.mockService.batchCreate(mockList);
    return result;
  }

  async findAll(query: Partial<QueryDto>) {
    return this.repository.find({ where: query });
  }

  async findOne(options: FindOneOptions<ApiData>): Promise<ApiData> {
    return await this.repository.findOne(options);
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
  async removeByGroupIDs(groupIDs = []) {
    this.repository
      .createQueryBuilder()
      .delete()
      .from(ApiData)
      .where('groupID IN (:...groupIDs)', { groupIDs })
      .execute();
  }
}

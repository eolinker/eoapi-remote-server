import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ApiData } from '../../entities/apiData.entity';
import { MockService } from '../mock/mock.service';
import { Mock } from '../../entities/mock.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';

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
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(ApiData)
      .values(createDto)
      .execute();
  }

  async findAll(query: QueryDto) {
    const apiData = await this.repository.find({ where: query });
    const mockApiDataIds = (
      await this.mockRepository.find({
        where: { apiDataID: In(apiData.map((n) => n.uuid)) },
      })
    ).map((n) => n.apiDataID);

    const noDefaultMockApiDatas = apiData
      .filter((n) => !mockApiDataIds.includes(n.uuid))
      .map((apiData) => this.mockService.createSystemMockDTO(apiData));

    if (noDefaultMockApiDatas.length) {
      await this.mockService.batchCreate(noDefaultMockApiDatas);
    }

    return apiData;
  }

  async findOne(uuid: number): Promise<ApiData> {
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mock } from '../../entities/mock.entity';
import { CreateDto, CreateWay } from './dto/create.dto';
import { CreateDto as ApiDataCreateDto } from '../apiData/dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { ApiData } from 'src/entities/apiData.entity';
import { Request } from 'express';
import { tree2obj } from 'src/utils';

@Injectable()
export class MockService {
  constructor(
    @InjectRepository(Mock)
    private readonly repository: Repository<Mock>,
    @InjectRepository(ApiData)
    private readonly apiDataRepository: Repository<ApiData>,
  ) {}

  async create(createDto: CreateDto, createWay: CreateWay = 'custom') {
    createDto.createWay = createWay;
    return await this.repository.save(createDto);
  }

  async batchCreate(createDto: Array<CreateDto>) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(Mock)
      .values(createDto)
      .execute();
  }

  async findAll(query: QueryDto) {
    return await this.repository.find(query);
  }

  async findOne(id: number): Promise<Mock> {
    return await this.repository.findOne(id);
  }

  async findMock(projectID: string, request: Request): Promise<string> {
    const { path, method, query, body, protocol } = request;
    const pathName = path.replace(`/mock/${projectID}`, '');

    if (Number.isNaN(+query.mockID)) {
      const apiData = await this.apiDataRepository
        .createQueryBuilder('api_data')
        .where('api_data.projectID = :projectID', {
          projectID: Number(projectID.replace('eo-', '')),
        })
        .andWhere('api_data.uri = :uri', { uri: pathName })
        .andWhere('api_data.method = :method', {
          method: method.toLocaleUpperCase(),
        })
        .andWhere('api_data.protocol = :protocol', { protocol })
        .getOne();

      if (!apiData) {
        return JSON.stringify({
          statusCode: 404,
          message: '没有匹配到该mock，请检查请求方法或路径是否正确。',
        });
      }
      return JSON.stringify(
        tree2obj([].concat(apiData.responseBody), {
          key: 'name',
          valueKey: 'description',
        }),
      );
    } else {
      const mock = await this.repository.findOne(+query.mockID);
      return mock?.response || '{}';
    }
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }

  createSystemMockDTO(apiData: ApiDataCreateDto & ApiData) {
    return {
      name: '默认 Mock',
      description: '系统默认mock',
      apiDataID: apiData.uuid,
      projectID: apiData.projectID,
      response: '',
      createWay: 'system',
    };
  }
}

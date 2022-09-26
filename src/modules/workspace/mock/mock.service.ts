import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiData } from 'src/entities/apiData.entity';
import { Request } from 'express';
import { tree2obj } from 'src/utils';
import { CreateDto as ApiDataCreateDto } from '../apiData/dto/create.dto';
import { CreateDto, CreateWay } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { Mock } from '@/entities/mock.entity';

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
    return await this.repository.find({ where: query });
  }

  async findOne(uuid: number): Promise<Mock> {
    return await this.repository.findOne({ where: { uuid } });
  }

  async findMock(projectID: string, request: Request): Promise<string> {
    const { path, method, query, body, protocol } = request;
    const pathName = path.replace(`/mock/${projectID}`, '');
    const pathReg = new RegExp(`/?${pathName}/?`);

    if (Number.isNaN(+query.mockID)) {
      const apiDataList = await this.apiDataRepository
        .createQueryBuilder('api_data')
        .where('api_data.projectID = :projectID', {
          projectID: Number(projectID.replace('eo-', '')),
        })
        // .andWhere('api_data.uri = :uri', { uri: pathName })
        .andWhere('api_data.method = :method', {
          method: method.toLocaleUpperCase(),
        })
        .andWhere('api_data.protocol = :protocol', { protocol })
        .getMany();

      const apiData = apiDataList.find((n) => {
        let uri = n.uri.trim();
        if (Array.isArray(n.restParams) && n.restParams.length > 0) {
          const restMap = n.restParams.reduce(
            (p, c) => ((p[c.name] = c.example), p),
            {},
          );
          uri = uri.replace(/\{(.+?)\}/g, (match, p) => restMap[p] ?? match);
          // console.log('restMap', restMap, n.uri, uri);
        }
        return n.method === method && pathReg.test(uri);
      });

      if (!apiData) {
        return JSON.stringify({
          statusCode: 404,
          message: '没有匹配到该mock，请检查请求方法或路径是否正确。',
        });
      }
      console.log('apiData', apiData);
      if (apiData.responseBodyType === 'raw') {
        return apiData.responseBody;
      } else if (apiData.responseBodyType === 'json') {
        return JSON.stringify(
          tree2obj([].concat(apiData.responseBody), {
            key: 'name',
            valueKey: 'description',
          }),
        );
      } else {
        return '{}';
      }
    } else {
      const mock = await this.repository.findOne({
        where: { uuid: Number(query.mockID) },
      });
      return mock?.response || '{}';
    }
  }

  async update(id: number, updateDto: UpdateDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }

  createSystemMockDTO(apiData: ApiData) {
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

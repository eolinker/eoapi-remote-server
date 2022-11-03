import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { Repository, FindOneOptions } from 'typeorm';
import { ApiData } from 'src/entities/apiData.entity';
import { Request } from 'express';
import { tree2obj } from 'src/utils';
import { CreateDto, CreateWay } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { Mock } from '@/entities/mock.entity';
import { ApiDataService } from '@/modules/workspace/apiData/apiData.service';

@Injectable()
export class MockService {
  private apiDataService: ApiDataService;
  constructor(
    @InjectRepository(Mock)
    private readonly repository: Repository<Mock>,
    @InjectRepository(ApiData)
    private readonly apiDataRepository: Repository<ApiData>,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.apiDataService = this.moduleRef.get(ApiDataService, { strict: false });
  }

  async create(createDto: CreateDto, createWay: CreateWay = 'custom') {
    const apiData = await this.apiDataRepository.findOneBy({
      uuid: createDto.apiDataID,
    });
    createDto.createWay = createWay;
    return await this.repository.save({ ...createDto, apiData });
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

  async findOne(options: FindOneOptions<Mock>): Promise<Mock> {
    return await this.repository.findOne(options);
  }

  isMatchUrl(apiData: ApiData, pathReg) {
    if (Array.isArray(apiData.restParams) && apiData.restParams.length > 0) {
      const restMap = apiData.restParams.reduce(
        (p, c) => ((p[c.name] = c.example), p),
        {},
      );
      const uri = apiData.uri.replace(
        /\{(.+?)\}/g,
        (match, p) => restMap[p] ?? match,
      );
      console.log('restMap', restMap, apiData.uri, uri);
      return pathReg.test(uri);
    }
    return false;
  }

  async findMock(projectID: number, mockID: number, request: Request) {
    const { path, method, params, body, protocol } = request;
    // const pathName = path.replace(`/mock/${projectID}`, '');
    // const pathReg = new RegExp(`/?${pathName}/?`);

    const mock = await this.repository.findOne({
      where: { uuid: mockID },
    });
    if (mock.createWay === 'custom') {
      try {
        return JSON.parse(mock.response);
      } catch (error) {
        return mock.response;
      }
    }
    const pathReg = new RegExp(`^/?${params[0]}/?$`);
    const apiData = await this.apiDataService.findOne({
      where: {
        protocol,
        uuid: mock.apiDataID,
        method: method.toLocaleUpperCase(),
      },
    });

    if (!apiData || this.isMatchUrl(apiData, pathReg)) {
      return new NotFoundException(
        '没有匹配到该mock，请检查请求方法或路径是否正确。',
      );
    }

    let result = '';

    if (apiData.responseBodyType === 'raw') {
      result = apiData.responseBody;
    } else if (apiData.responseBodyType === 'json') {
      result = JSON.stringify(
        tree2obj([].concat(apiData.responseBody), {
          key: 'name',
          valueKey: 'description',
        }),
      );
    }
    try {
      return JSON.parse(result);
    } catch (error) {
      return result;
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
      response: apiData.responseBody || '[]',
      createWay: 'system',
    };
  }
}

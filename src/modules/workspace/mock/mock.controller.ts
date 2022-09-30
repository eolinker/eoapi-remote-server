import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  All,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { MockService } from './mock.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';

@ApiTags('Mock')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/mock`)
export class MockController {
  constructor(private readonly service: MockService) {}

  @Post()
  async create(@Body() createDto: CreateDto) {
    const data = await this.service.create(createDto);
    return this.findOne(`${data.uuid}`);
  }

  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>) {
    return this.service.batchCreate(createDto);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.service.findAll(query);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(+uuid);
  }

  @All(':projectID/**')
  async findMock(
    @Param('projectID') projectID: string,
    @Req() request: Request,
  ) {
    return this.service.findMock(projectID, request);
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateDto) {
    await this.service.update(+uuid, updateDto);
    return await this.findOne(uuid);
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    const mock = await this.service.findOne(+uuid);
    if (mock.createWay === 'system') {
      return new BadRequestException('系统自动创建的mock不能删除');
    }
    return this.service.remove(+uuid);
  }
}

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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { MockService } from './mock.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Mock')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/mock`)
export class MockController {
  constructor(private readonly service: MockService) {}

  @Post()
  async create(@Body() createDto: CreateDto, @Param('projectID') projectID) {
    const data = await this.service.create({ ...createDto, projectID });
    return this.findOne(data.uuid, projectID);
  }

  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>) {
    return this.service.batchCreate(createDto);
  }

  @Get()
  async findAll(@Query() query: QueryDto, @Param('projectID') projectID) {
    return this.service.findAll({ ...query, projectID });
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid, @Param('projectID') projectID) {
    return this.service.findOne({ where: { uuid, projectID } });
  }

  @All(':mockID/**')
  @Public()
  async findMock(
    @Param('projectID', ParseIntPipe) projectID: number,
    @Param('mockID', ParseIntPipe) mockID: number,
    @Req() request: Request,
  ) {
    return this.service.findMock(projectID, mockID, request);
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Param('projectID') projectID,
    @Body() updateDto: UpdateDto,
  ) {
    await this.service.update(+uuid, updateDto);
    return await this.findOne(uuid, projectID);
  }

  @Delete(':uuid')
  async remove(
    @Param('uuid', ParseIntPipe) uuid: number,
    @Param('projectID') projectID,
  ) {
    const mock = await this.service.findOne({ where: { uuid, projectID } });
    if (mock.createWay === 'system') {
      return new BadRequestException('系统自动创建的mock不能删除');
    }
    return this.service.remove(+uuid);
  }
}

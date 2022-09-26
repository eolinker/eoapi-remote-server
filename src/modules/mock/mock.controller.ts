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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { MockService } from './mock.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';

@ApiTags('Mock')
@Controller('mock')
export class MockController {
  private readonly NOT_FOUND = {
    statusCode: 201,
    message: 'Cannot find record in database',
    error: 'Not Found',
  };

  constructor(private readonly service: MockService) {}

  @Post()
  async create(@Body() createDto: CreateDto) {
    const data = await this.service.create(createDto);
    if (data && data.uuid) {
      return await this.findOne(`${data.uuid}`);
    }
    return this.NOT_FOUND;
  }

  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>) {
    const data = await this.service.batchCreate(createDto);
    return {
      statusCode: 200,
      data: data,
    };
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    const data = await this.service.findAll(query);
    return {
      statusCode: 200,
      data: data,
    };
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    const data = await this.service.findOne(+uuid);
    if (data) {
      return {
        statusCode: 200,
        data: data,
      };
    }

    return this.NOT_FOUND;
  }

  @All(':projectID/**')
  async findMock(
    @Param('projectID') projectID: string,
    @Req() request: Request,
  ) {
    const response = await this.service.findMock(projectID, request);

    return response ?? this.NOT_FOUND;
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateDto) {
    const data = await this.service.update(+uuid, updateDto);
    if (data) {
      return await this.findOne(uuid);
    }

    return this.NOT_FOUND;
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    const mock = await this.service.findOne(+uuid);
    if (mock.createWay === 'system') {
      return {
        statusCode: 200,
        data: {},
        message: '系统自动创建的mock不能删除',
      };
    }
    const data = await this.service.remove(+uuid);
    if (data && data.affected > 0) {
      return {
        statusCode: 200,
        data: data,
      };
    }

    return this.NOT_FOUND;
  }
}

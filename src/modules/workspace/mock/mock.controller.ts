import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MockService } from './mock.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
} from '@/common/class/res.class';
import { Mock } from '@/entities/mock.entity';

@ApiTags('Mock')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/mock`)
export class MockController {
  constructor(private readonly service: MockService) {}

  @ApiCreatedResponseData(Mock)
  @Post()
  async create(@Body() createDto: CreateDto, @Param('projectID') projectID) {
    const data = await this.service.create({ ...createDto, projectID });
    return this.findOne(data.uuid, projectID);
  }

  @ApiCreatedResponseData()
  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>) {
    return this.service.batchCreate(createDto);
  }

  @ApiOkResponseData(Mock, 'array')
  @Get()
  async findAll(@Query() query: QueryDto, @Param('projectID') projectID) {
    return this.service.findAll({ ...query, projectID });
  }

  @ApiOkResponseData(Mock)
  @Get(':uuid')
  async findOne(@Param('uuid') uuid, @Param('projectID') projectID) {
    return this.service.findOne({ where: { uuid, projectID } });
  }

  @ApiOkResponseData(Mock)
  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Param('projectID') projectID,
    @Body() updateDto: UpdateDto,
  ) {
    await this.service.update(+uuid, updateDto);
    return await this.findOne(uuid, projectID);
  }

  @ApiOkResponseData()
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

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateQueryPipe } from 'src/pipe/query.pipe';
import { ApiGroupService } from './apiGroup.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';

@ApiTags('apiGroup')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/group`)
export class ApiGroupController {
  constructor(private readonly service: ApiGroupService) {}

  @Post()
  async create(@Body() createDto: CreateDto, @Param('projectID') projectID) {
    const { uuid } = await this.service.create({ ...createDto, projectID });
    return await this.findOne(uuid, projectID);
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
  async findOne(
    @Param('uuid', ParseIntPipe) uuid: number,
    @Param('projectID') projectID,
  ) {
    return this.service.findOne({ where: { uuid, projectID } });
  }
  @Put('batch')
  async batchUpdate(@Body() updateDtos: Array<UpdateDto>) {
    const ids = updateDtos.map((val) => val.uuid);
    const array = await this.service.findByIds(ids);
    const newArr = array.map((el) => {
      const item = updateDtos.find((val) => val.uuid == el.uuid);
      return {
        ...el,
        parentID: item.parentID,
        weight: item.weight,
      };
    });
    const data = await this.service.bulkUpdate(newArr);
    if (data) {
      return this.service.findByIds(ids);
    }
    return new BadRequestException('批量修改失败！');
  }
  @Put(':uuid')
  async update(
    @Param('uuid', ParseIntPipe) uuid: number,
    @Param('projectID') projectID,
    @Body() updateDto: UpdateDto,
  ) {
    const data = await this.service.update(+uuid, updateDto);
    if (data) {
      return await this.findOne(uuid, projectID);
    }

    return new NotFoundException('修改失败！分组不存在');
  }

  @Delete()
  async remove(@Query(ValidateQueryPipe) query) {
    const data = await this.service.remove(query.uuids);
    if (data && data.affected > 0) {
      return data;
    }

    return new NotFoundException('删除失败！该分组不存在');
  }
}

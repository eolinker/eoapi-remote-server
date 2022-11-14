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
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
} from '@/common/class/res.class';
import { ApiGroup } from '@/entities/apiGroup.entity';

@ApiTags('apiGroup')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/group`)
export class ApiGroupController {
  constructor(private readonly service: ApiGroupService) {}

  @ApiCreatedResponseData(ApiGroup)
  @Post()
  async create(@Body() createDto: CreateDto, @Param('projectID') projectID) {
    const { uuid } = await this.service.create({ ...createDto, projectID });
    return await this.findOne(uuid, projectID);
  }

  @ApiCreatedResponseData()
  @Post('batch')
  async batchCreate(
    @Param('projectID') projectID,
    @Body() createDto: Array<CreateDto>,
  ) {
    return this.service.batchCreate(
      createDto.map((n) => ({ ...n, projectID })),
    );
  }

  @ApiOkResponseData(ApiGroup, 'array')
  @Get()
  async findAll(@Query() query: QueryDto, @Param('projectID') projectID) {
    return this.service.findAll({ ...query, projectID });
  }

  @ApiOkResponseData(ApiGroup)
  @Get(':uuid')
  async findOne(
    @Param('uuid', ParseIntPipe) uuid: number,
    @Param('projectID') projectID,
  ) {
    return this.service.findOne({ where: { uuid, projectID } });
  }
  @ApiOkResponseData()
  @Put('batch')
  async batchUpdate(
    @Param('projectID') projectID,
    @Body() updateDtos: Array<UpdateDto>,
  ) {
    const ids = updateDtos.map((val) => val.uuid);
    const array = await this.service.findByIds(ids);
    const newArr = array.map((el) => {
      const item = updateDtos.find((val) => val.uuid == el.uuid);
      return {
        ...el,
        projectID,
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

  @ApiOkResponseData(ApiGroup)
  @Put(':uuid')
  async update(
    @Param('uuid', ParseIntPipe) uuid: number,
    @Param('projectID') projectID,
    @Body() updateDto: UpdateDto,
  ) {
    const data = await this.service.update(+uuid, { ...updateDto, projectID });
    if (data) {
      return await this.findOne(uuid, projectID);
    }

    return new NotFoundException('修改失败！分组不存在');
  }

  @ApiOkResponseData()
  @Delete()
  async remove(@Param('projectID') projectID, @Query(ValidateQueryPipe) query) {
    const data = await this.service.remove(query.uuids, projectID);
    if (data && data.affected > 0) {
      return data;
    }

    return new NotFoundException('删除失败！该分组不存在');
  }
}

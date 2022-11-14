import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateQueryPipe } from 'src/pipe/query.pipe';
import { InsertResult } from 'typeorm';
import { ApiDataService } from './apiData.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
} from '@/common/class/res.class';
import { ApiData } from '@/entities/apiData.entity';

@ApiTags('apiData')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/api_data`)
export class ApiDataController {
  private readonly JSON_FIELDS = [
    'requestHeaders',
    'requestBody',
    'queryParams',
    'restParams',
    'responseHeaders',
    'responseBody',
  ];

  constructor(private readonly service: ApiDataService) {}
  filterItem(item: any = {}, projectID) {
    this.JSON_FIELDS.forEach((field) => {
      item[field] = item[field] ? JSON.stringify(item[field]) : '[]';
      item.projectID = projectID;
    });
    return item;
  }

  @ApiCreatedResponseData(ApiData)
  @Post()
  async create(@Body() createDto: CreateDto, @Param('projectID') projectID) {
    createDto = this.filterItem(createDto, projectID);
    return this.service.create({ ...createDto, projectID });
  }

  @ApiCreatedResponseData(InsertResult)
  @Post('batch')
  async batchCreate(
    @Body() createDto: Array<CreateDto>,
    @Param('projectID') projectID,
  ) {
    createDto.map((val) => {
      return this.filterItem(val, projectID);
    });
    return this.service.batchCreate(createDto);
  }

  @ApiOkResponseData(ApiData, 'array')
  @Get()
  async findAll(@Param('projectID') projectID, @Query() query: QueryDto) {
    return this.service.findAll({ ...query, projectID });
  }

  @ApiOkResponseData(ApiData)
  @Get(':uuid')
  async findOne(@Param('uuid') uuid, @Param('projectID') projectID) {
    return this.service.findOne({ where: { uuid, projectID } });
  }

  @ApiOkResponseData(ApiData, 'array')
  @Put('batch')
  async batchUpdate(
    @Body() updateDtos: Array<UpdateDto>,
    @Param('projectID') projectID,
  ) {
    const ids = updateDtos.map((val) => val.uuid);
    const array = await this.service.findByIds(ids);
    const newArr = array.map((el) => {
      const item = updateDtos.find((val) => Number(val.uuid) === el.uuid);
      return this.filterItem(
        {
          ...el,
          groupID: Number(item.groupID),
          weight: item.weight,
        },
        projectID,
      );
    });
    return this.service.bulkUpdate(newArr);
  }

  @ApiOkResponseData(ApiData)
  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Param('projectID') projectID,
    @Body() updateDto: UpdateDto,
  ) {
    updateDto = this.filterItem(updateDto, projectID);
    return this.service.update(+uuid, updateDto);
  }

  @Delete()
  async remove(@Query(ValidateQueryPipe) query) {
    return this.service.remove(query.uuids);
  }
}

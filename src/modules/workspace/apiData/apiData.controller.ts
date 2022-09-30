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
import { ApiDataService } from './apiData.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';

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
  filterItem(item: any = {}) {
    this.JSON_FIELDS.forEach((field) => {
      item[field] = item[field] ? JSON.stringify(item[field]) : '{}';
    });
    return item;
  }
  @Post()
  async create(@Body() createDto: CreateDto) {
    createDto = this.filterItem(createDto);
    return this.service.create(createDto);
  }

  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>) {
    createDto.map((val) => {
      return this.filterItem(val);
    });
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
  @Put('batch')
  async batchUpdate(@Body() updateDtos: Array<UpdateDto>) {
    const ids = updateDtos.map((val) => val.uuid);
    const array = await this.service.findByIds(ids);
    const newArr = array.map((el) => {
      const item = updateDtos.find((val) => Number(val.uuid) === el.uuid);
      return this.filterItem({
        ...el,
        groupID: Number(item.groupID),
        weight: item.weight,
      });
    });
    return this.service.bulkUpdate(newArr);
  }
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateDto) {
    updateDto = this.filterItem(updateDto);
    return this.service.update(+uuid, updateDto);
  }

  @Delete()
  async remove(@Query(ValidateQueryPipe) query) {
    return this.service.remove(query.uuids);
  }
}

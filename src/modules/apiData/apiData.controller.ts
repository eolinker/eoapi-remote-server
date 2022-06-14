import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiDataService } from './apiData.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidateQueryPipe } from 'src/pipe/query.pipe';
import { retry } from 'rxjs';

@Controller('api_data')
@UseGuards(AuthGuard('api-key'))
export class ApiDataController {
  private readonly NOT_FOUND = {
    statusCode: 201,
    message: 'Cannot find record in database',
    error: 'Not Found',
  };

  private readonly JSON_FIELDS = [
    'requestHeaders',
    'requestBody',
    'queryParams',
    'restParams',
    'responseHeaders',
    'responseBody',
  ];

  constructor(private readonly service: ApiDataService) {}
  filterItem(item) {
    this.JSON_FIELDS.forEach((field) => {
      if (item[field]) {
        item[field] = JSON.stringify(item[field]);
      }
    });
    return item;
  }
  @Post()
  async create(@Body() createDto: CreateDto) {
    createDto=this.filterItem(createDto);
    const data = await this.service.create(createDto);
    if (data && data.uuid) {
      return await this.findOne(`${data.uuid}`);
    }

    return this.NOT_FOUND;
  }

  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>) {
    createDto.map((val) => {
      return this.filterItem(val);
    });
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
  @Put('batch')
  async batchUpdate(@Body() updateDtos: Array<UpdateDto>) {
    let ids = updateDtos.map((val) => val.uuid);
    const array = await this.service.findByIds(ids);
    const newArr = array.map((el) => {
      let item = updateDtos.find((val) => val.uuid === el.uuid);
      item=this.filterItem(item);
      return {
        ...el,
        groupID: item.groupID,
        weight: item.weight,
      };
    });
    const data = await this.service.bulkUpdate(newArr);
    if (data) {
      return this.service.findByIds(ids);
    }
    return this.NOT_FOUND;
  }
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateDto) {
    updateDto=this.filterItem(updateDto);
    const data = await this.service.update(+uuid, updateDto);
    if (data) {
      return await this.findOne(uuid);
    }
    return this.NOT_FOUND;
  }

  @Delete()
  async remove(@Query(ValidateQueryPipe) query) {
    const data = await this.service.remove(query.uuids);
    if (data && data.affected > 0) {
      return {
        statusCode: 200,
        data: data,
      };
    }

    return this.NOT_FOUND;
  }
}

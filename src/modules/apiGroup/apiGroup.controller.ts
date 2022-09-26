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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateQueryPipe } from 'src/pipe/query.pipe';
import { ApiGroupService } from './apiGroup.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';

@ApiBearerAuth()
@ApiTags('apiGroup')
@Controller('group')
export class ApiGroupController {
  private readonly NOT_FOUND = {
    statusCode: 201,
    message: 'Cannot find record in database',
    error: 'Not Found',
  };

  constructor(private readonly service: ApiGroupService) {}

  @Post()
  async create(@Body() createDto: CreateDto) {
    const data = await this.service.create(createDto);
    if (data && data.uuid) {
      return await this.findOne(data.uuid);
    }

    return this.NOT_FOUND;
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
  async findOne(@Param('uuid', ParseIntPipe) uuid: number) {
    return this.service.findOne(uuid);
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
    return this.NOT_FOUND;
  }
  @Put(':uuid')
  async update(
    @Param('uuid', ParseIntPipe) uuid: number,
    @Body() updateDto: UpdateDto,
  ) {
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
      return data;
    }

    return this.NOT_FOUND;
  }
}

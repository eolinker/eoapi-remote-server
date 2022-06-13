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
import { ApiGroupService } from './apiGroup.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidateQueryPipe } from 'src/pipe/query.pipe';

@Controller('group')
@UseGuards(AuthGuard('api-key'))
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

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateDto) {
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

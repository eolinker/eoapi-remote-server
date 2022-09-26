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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ValidateQueryPipe } from 'src/pipe/query.pipe';
import { ApiTestHistoryService } from './apiTestHistory.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';

@ApiTags('apiTestHistory')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/api_test_history`)
@UseGuards(AuthGuard('api-key'))
export class ApiTestHistoryController {
  private readonly NOT_FOUND = {
    statusCode: 201,
    message: 'Cannot find record in database',
    error: 'Not Found',
  };

  private readonly JSON_FIELDS = ['general', 'request', 'response'];

  constructor(private readonly service: ApiTestHistoryService) {}

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
    createDto.map((val) => {
      this.JSON_FIELDS.forEach((field) => {
        if (val[field]) {
          val[field] = JSON.stringify(val[field]);
        }
      });
      return val;
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

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateDto) {
    this.JSON_FIELDS.forEach((field) => {
      if (updateDto[field]) {
        updateDto[field] = JSON.stringify(updateDto[field]);
      }
    });
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

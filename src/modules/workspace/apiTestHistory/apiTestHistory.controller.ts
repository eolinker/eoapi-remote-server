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
import { ApiTestHistoryService } from './apiTestHistory.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';

@ApiTags('apiTestHistory')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/api_test_history`)
export class ApiTestHistoryController {
  private readonly JSON_FIELDS = ['general', 'request', 'response'];

  constructor(private readonly service: ApiTestHistoryService) {}

  @Post()
  async create(@Body() createDto: CreateDto) {
    const data = await this.service.create(createDto);
    return await this.findOne(`${data.uuid}`);
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
    await this.service.update(+uuid, updateDto);
    return await this.findOne(uuid);
  }

  @Delete()
  async remove(@Query(ValidateQueryPipe) query) {
    return await this.service.remove(query.uuids);
  }
}

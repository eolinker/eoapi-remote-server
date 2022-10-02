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
import { EnvironmentService } from './environment.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';

@ApiTags('Environment')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/environment`)
export class EnvironmentController {
  private readonly NOT_FOUND = {
    statusCode: 201,
    message: 'Cannot find record in database',
    error: 'Not Found',
  };

  private readonly JSON_FIELDS = ['parameters'];

  constructor(private readonly service: EnvironmentService) {}

  @Post()
  async create(@Body() createDto: CreateDto, @Param('projectID') projectID) {
    this.JSON_FIELDS.forEach((field) => {
      if (createDto[field]) {
        createDto[field] = JSON.stringify(createDto[field]);
      }
    });
    const data = await this.service.create({ ...createDto, projectID });
    if (data && data.uuid) {
      return await this.findOne(data.uuid, projectID);
    }

    return this.NOT_FOUND;
  }

  @Post('batch')
  async batchCreate(
    @Body() createDto: Array<CreateDto>,
    @Param('projectID') projectID,
  ) {
    createDto.map((val) => {
      this.JSON_FIELDS.forEach((field) => {
        if (val[field]) {
          val[field] = JSON.stringify(val[field]);
        }
        val['projectID'] = projectID;
      });
      return val;
    });
    return this.service.batchCreate(createDto);
  }

  @Get()
  async findAll(@Query() query: QueryDto, @Param('projectID') projectID) {
    return this.service.findAll({ where: { ...query, projectID } });
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid, @Param('projectID') projectID) {
    return this.service.findOne({ where: { uuid, projectID } });
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Param('projectID') projectID,
    @Body() updateDto: UpdateDto,
  ) {
    this.JSON_FIELDS.forEach((field) => {
      if (updateDto[field]) {
        updateDto[field] = JSON.stringify(updateDto[field]);
      }
    });
    const data = await this.service.update(+uuid, updateDto);
    if (data) {
      return await this.findOne(uuid, projectID);
    }

    return this.NOT_FOUND;
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(+uuid);
  }
}

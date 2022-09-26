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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { ImportDto } from './dto/import.dto';

@ApiBearerAuth()
@ApiTags('Project')
@Controller('project')
export class ProjectController {
  private readonly NOT_FOUND = {
    statusCode: 201,
    message: 'Cannot find record in database',
    error: 'Not Found',
  };

  constructor(private readonly service: ProjectService) {}

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
    return this.service.batchCreate(createDto);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.service.findAll(query);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    const data = await this.service.findOne(+uuid);
    if (data) {
      return data;
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

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    const data = await this.service.remove(+uuid);
    if (data && data.affected > 0) {
      return data;
    }

    return this.NOT_FOUND;
  }

  @Put(':uuid/import')
  async import(@Param('uuid') uuid: string, @Body() importDto: ImportDto) {
    // console.log('uuid', uuid, importDto);
    const data = await this.service.import(Number(uuid), importDto);
    return {
      statusCode: 200,
      data: {
        errors: data,
      },
    };
  }
}

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
import { EnvironmentService } from './environment.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';

@Controller('environment')
export class EnvironmentController {
  private readonly NOT_FOUND = {
    statusCode: 201,
    message: 'Cannot find record in database',
    error: 'Not Found',
  };

  private readonly JSON_FIELDS = ['parameters'];

  constructor(private readonly service: EnvironmentService) {}

  @Post()
  async create(@Body() createDto: CreateDto) {
    this.JSON_FIELDS.forEach((field) => {
      if (createDto[field]) {
        createDto[field] = JSON.stringify(createDto[field]);
      }
    });
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

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    const data = await this.service.remove(+uuid);
    if (data && data.affected > 0) {
      return {
        statusCode: 200,
        data: data,
      };
    }

    return this.NOT_FOUND;
  }
}

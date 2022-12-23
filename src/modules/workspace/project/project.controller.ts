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
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { CollectionsDto, QueryDto } from './dto/query.dto';
import { ImportDto } from './dto/import.dto';
import { WORKSPACE_ID_PREFIX } from '@/common/contants/prefix.contants';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
} from '@/common/class/res.class';
import { Project } from '@/entities/project.entity';
import {
  ExportProjectResultDto,
  ExportCollectionsResultDto,
} from '@/modules/workspace/project/dto/export.dto';
import { RolesGuard } from '@/guards';

@ApiTags('Project')
@Controller(`${WORKSPACE_ID_PREFIX}/project`)
@UseGuards(RolesGuard)
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @ApiCreatedResponseData(Project)
  @Post()
  async create(
    @Param('workspaceID', ParseIntPipe) workspaceID,
    @Body() createDto: CreateDto,
  ) {
    const data = await this.service.create(createDto, workspaceID);
    return this.findOne(workspaceID, `${data.uuid}`);
  }

  @ApiCreatedResponseData()
  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>) {
    return this.service.batchCreate(createDto);
  }

  @ApiOkResponseData(Project, 'array')
  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Param('workspaceID', ParseIntPipe) workspaceID,
  ) {
    return this.service.findAll(query, workspaceID);
  }

  @ApiOkResponseData(Project)
  @Get(':projectID')
  async findOne(
    @Param('projectID', ParseIntPipe) projectID,
    @Param('workspaceID', ParseIntPipe) workspaceID,
  ) {
    return this.service.findOne(workspaceID, projectID);
  }
  @ApiOkResponseData(Project)
  @Put(':projectID')
  async update(
    @Param('projectID') projectID: string,
    @Param('workspaceID', ParseIntPipe) workspaceID,
    @Body() updateDto: UpdateDto,
  ) {
    const data = await this.service.update(+projectID, updateDto);
    if (data) {
      return await this.findOne(workspaceID, projectID);
    }

    return new NotFoundException('更新失败！项目不存在');
  }
  @ApiOkResponseData()
  @Delete(':projectID')
  async remove(@Param('projectID') projectID: string) {
    const data = await this.service.remove(+projectID);
    if (data && data.affected > 0) {
      return data;
    }

    return new NotFoundException('删除失败！项目不存在');
  }

  @ApiOkResponseData()
  @Put(':projectID/import')
  async import(
    @Param('projectID') projectID: string,
    @Param('workspaceID', ParseIntPipe) workspaceID,
    @Body() importDto: ImportDto,
  ) {
    // console.log('projectID', projectID, importDto);
    return this.service.import(workspaceID, Number(projectID), importDto);
  }

  @ApiOkResponseData(ExportCollectionsResultDto)
  @Get(':projectID/export/collections')
  async export(
    @Param('projectID') projectID: string,
    @Param('workspaceID', ParseIntPipe) workspaceID,
  ) {
    // console.log('projectID', projectID, importDto);
    return this.service.exportCollections(workspaceID, Number(projectID));
  }

  @ApiOkResponseData(ExportProjectResultDto)
  @Get(':projectID/export')
  async projectExport(@Param('projectID') projectID: string) {
    // console.log('projectID', projectID, importDto);
    return this.service.projectExport(Number(projectID));
  }

  @ApiOkResponseData(CollectionsDto)
  @Get(':projectID/collections')
  async getProjectCollections(
    @Param('projectID', ParseIntPipe) projectID: number,
  ) {
    return this.service.getProjectCollections(projectID);
  }
}

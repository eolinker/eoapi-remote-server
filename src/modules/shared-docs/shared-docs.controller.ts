import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDataService } from '../workspace/apiData/apiData.service';
import { XHeader } from '@/common/decorators/xheader.decorator';
import { SharedAuthGuard } from '@/modules/shared-docs/guards/shared-auth.guard';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { Public } from '@/common/decorators/public.decorator';
import { EnvironmentService } from '@/modules/workspace/environment/environment.service';
import { ApiOkResponseData } from '@/common/class/res.class';
import { CollectionsDto } from '@/modules/shared-docs/dto';
import { ApiData } from '@/entities/apiData.entity';
import { Environment } from '@/entities/environment.entity';

@ApiTags('shared-docs')
@UseGuards(SharedAuthGuard)
@Controller('shared-docs')
export class SharedDocsController {
  constructor(
    private readonly apiDataService: ApiDataService,
    private readonly projectService: ProjectService,
    private readonly environmentService: EnvironmentService,
  ) {}

  @ApiOperation({
    summary: '获取所有分组及API',
  })
  @Public()
  @ApiOkResponseData(CollectionsDto)
  @Get(':uniqueID/collections')
  async collections(@XHeader('projectID') projectID: number) {
    return this.projectService.getProjectCollections(projectID);
  }

  @ApiOperation({
    summary: '获取API详情',
  })
  @ApiOkResponseData(ApiData)
  @Public()
  @Get(':uniqueID/api/:apiDataUUID')
  async getApidataInfo(@Param('apiDataUUID') apiDataUUID: number) {
    return this.apiDataService.findOne({ where: { uuid: apiDataUUID } });
  }

  @ApiOperation({
    summary: '获取环境列表',
  })
  @ApiOkResponseData(Environment, 'array')
  @Public()
  @Get(':uniqueID/environments')
  async environments(@XHeader('projectID') projectID: number) {
    return this.environmentService.findAll({ where: { projectID } });
  }
}

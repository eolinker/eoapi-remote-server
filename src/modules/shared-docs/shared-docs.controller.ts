import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDataService } from '../workspace/apiData/apiData.service';
import { LoginToken } from '@/modules/auth/auth.class';
import { XHeader } from '@/common/decorators/xheader.decorator';
import { SharedAuthGuard } from '@/modules/shared-docs/guards/shared-auth.guard';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { Public } from '@/common/decorators/public.decorator';
import { EnvironmentService } from '@/modules/workspace/environment/environment.service';

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
  @ApiOkResponse({ type: LoginToken })
  @Get(':uniqueID/collections')
  async collections(@XHeader('projectID') projectID: number) {
    return this.projectService.getProjectCollections(projectID);
  }

  @ApiOperation({
    summary: '获取API详情',
  })
  @Public()
  @Get(':uniqueID/api/:apiDataUUID')
  async getApidataInfo(@Param('apiDataUUID') apiDataUUID: number) {
    return this.apiDataService.findOne({ where: { uuid: apiDataUUID } });
  }

  @ApiOperation({
    summary: '获取环境列表',
  })
  @Public()
  @Get(':uniqueID/environments')
  async environments(@XHeader('projectID') projectID: number) {
    return this.environmentService.findAll({ where: { projectID } });
  }
}

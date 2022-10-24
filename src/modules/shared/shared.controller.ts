import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDataService } from './../workspace/apiData/apiData.service';
import { SharedService } from './shared.service';
import { LoginToken } from '@/modules/auth/auth.class';
import { XHeader } from '@/common/decorators/xheader.decorator';
import { SharedAuthGuard } from '@/modules/shared/guards/shared-auth.guard';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('shared')
@UseGuards(SharedAuthGuard)
@Controller('shared')
export class SharedController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly apiDataService: ApiDataService,
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @ApiOperation({ summary: '新增分享' })
  async createShared(@XHeader('projectID') projectID: number) {
    return this.sharedService.createShared(projectID);
  }

  @Delete(':uniqueID')
  @ApiOperation({ summary: '删除分享' })
  async deleteShared(
    @XHeader('projectID') projectID: number,
    @Param('uniqueID') uniqueID: string,
  ) {
    return this.sharedService.deleteShared(uniqueID, projectID);
  }

  @Get()
  @ApiOperation({ summary: '获取已分享列表' })
  async getShared(@XHeader('projectID') projectID: number) {
    return this.sharedService.getShared(projectID);
  }

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
  async refreshToken(@Param('apiDataUUID') apiDataUUID: number) {
    return this.apiDataService.findOne({ where: { uuid: apiDataUUID } });
  }
}

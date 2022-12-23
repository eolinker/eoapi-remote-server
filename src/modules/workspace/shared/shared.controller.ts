import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SharedService } from './shared.service';
import { WORKSPACE_PROJECT_PREFIX } from '@/common/contants/prefix.contants';
import { ApiCreatedResponseData } from '@/common/class/res.class';
import { SharedEntity } from '@/entities/shared.entity';
import { RolesGuard } from '@/guards';

@ApiTags('Shared')
@Controller(`${WORKSPACE_PROJECT_PREFIX}/shared`)
@UseGuards(RolesGuard)
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Post()
  @ApiCreatedResponseData(SharedEntity)
  @ApiOperation({ summary: '新增分享' })
  async createShared(@Param('projectID') projectID: number) {
    return this.sharedService.createShared(projectID);
  }

  @Delete(':uniqueID')
  @ApiOperation({ summary: '删除分享' })
  async deleteShared(
    @Param('projectID') projectID: number,
    @Param('uniqueID') uniqueID: string,
  ) {
    return this.sharedService.deleteShared(uniqueID, projectID);
  }

  @Get()
  @ApiOperation({ summary: '获取已分享列表' })
  async getShared(@Param('projectID') projectID: number) {
    return this.sharedService.getShared(projectID);
  }
}

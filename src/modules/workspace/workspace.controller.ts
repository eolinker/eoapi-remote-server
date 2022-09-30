import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { WorkspaceService } from './workspace.service';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceMemberAddDto,
  WorkspaceMemberRemoveDto,
  WorkspaceUser,
} from './workspace.dto';
import { WorkspaceEntity } from '@/entities/workspace.entity';
import { IUser, User } from '@/common/decorators/user.decorator';
import { UserEntity } from '@/entities/user.entity';
import { Collections } from '@/modules/workspace/project/dto/import.dto';
import { ProjectService } from '@/modules/workspace/project/project.service';

@ApiBearerAuth()
@ApiTags('workspace')
@Controller('workspace')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建空间' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @User() user: IUser,
    @Body() createDto: CreateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    return this.workspaceService.create(user.userId, createDto);
  }

  @Post('upload')
  @ApiOperation({ summary: '导入本地数据并创建空间' })
  async importLocalData(@User() user: IUser, @Body() collections: Collections) {
    const workspace = await this.workspaceService.create(user.userId, {
      title: '默认空间',
    });
    const exportResult = await this.projectService.import(
      workspace.id,
      workspace.projects.at(0).uuid,
      collections,
    );
    if (typeof exportResult === 'string') {
      return new Error(exportResult);
    } else {
      return {
        ...exportResult,
        workspace,
      };
    }
  }

  @Put(':workspaceID')
  @ApiOperation({ summary: '修改空间名称' })
  async update(
    @Param('workspaceID', ParseIntPipe) id,
    @Body() updateDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    return this.workspaceService.update(id, updateDto);
  }

  @Delete(':workspaceID')
  @ApiOperation({ summary: '删除空间' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteWorkspace(
    @User() user: IUser,
    @Param('workspaceID', ParseIntPipe) id,
  ): Promise<DeleteResult> {
    const workspace = await this.workspaceService.findOne({ where: { id } });
    if (!workspace) {
      throw new NotFoundException('删除失败，空间不存在');
    }
    if (user.userId !== workspace.creatorID) {
      throw new UnauthorizedException('无删除该空间权限，请联系空间创建者');
    }
    return this.workspaceService.delete(id);
  }

  @Get()
  @ApiOperation({ summary: '获取空间列表' })
  list(@User() user: IUser): Promise<WorkspaceEntity[]> {
    return this.workspaceService.list(user.userId);
  }

  @Get(':workspaceID/member/list')
  @ApiOperation({ summary: '获取空间成员列表' })
  async getMemberList(@Param('workspaceID') id): Promise<WorkspaceUser[]> {
    return this.workspaceService.getMemberList(id);
  }

  @Get(':workspaceID/member/list/:username')
  @ApiOperation({ summary: '搜索空间成员' })
  @ApiResponse({
    type: [UserEntity],
  })
  async searchMemberByName(
    @Param('workspaceID') id,
    @Param('username') username,
  ): Promise<WorkspaceUser[]> {
    return this.workspaceService.getMemberList(id, username);
  }

  @Post(':workspaceID/member/add')
  @ApiOperation({ summary: '添加空间成员' })
  async memberAdd(
    @User() user: IUser,
    @Param('workspaceID') id,
    @Body() createCatDto: WorkspaceMemberAddDto,
  ) {
    const workspace = await this.workspaceService.findOne({ where: { id } });
    if (user.userId !== workspace.creatorID) {
      throw new UnauthorizedException('无该空间添加成员权限，请联系空间创建者');
    }
    return this.workspaceService.addMembers(id, createCatDto.userIDs);
  }

  @Delete(':workspaceID/member/remove')
  @ApiOperation({ summary: '移除空间成员' })
  async memberRemove(
    @User() user: IUser,
    @Param('workspaceID') id,
    @Body() createCatDto: WorkspaceMemberRemoveDto,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.workspaceService.findOne({ where: { id } });
    if (!workspace) {
      throw new UnauthorizedException('空间不存在');
    }
    if (user.userId !== workspace.creatorID) {
      throw new UnauthorizedException('无移除该空间成员权限，请联系空间创建者');
    }
    if (createCatDto.userIDs.includes(user.userId)) {
      throw new ForbiddenException('空间创建者不能移除自己');
    }
    return this.workspaceService.removeMembers(id, createCatDto.userIDs);
  }
}

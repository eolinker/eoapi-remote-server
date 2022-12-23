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
  UseGuards,
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
  RolePermissionDto,
  SetRoleDto,
  UpdateWorkspaceDto,
  WorkspaceMemberAddDto,
  WorkspaceMemberRemoveDto,
  WorkspaceUser,
} from './workspace.dto';
import { WorkspaceEntity } from '@/entities/workspace.entity';
import { IUser, User } from '@/common/decorators/user.decorator';
import { UserEntity } from '@/entities/user.entity';
import { ImportDto } from '@/modules/workspace/project/dto/import.dto';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { sampleApiData } from '@/modules/workspace/apiData/samples/sample.api.data';
import { ApiDataService } from '@/modules/workspace/apiData/apiData.service';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
} from '@/common/class/res.class';
import { RolesGuard } from '@/guards';
import { RoleEntity } from '@/entities/role.entity';
import { Permissions } from '@/common/decorators/permission.decorator';
import { PermissionEnum } from '@/enums/permission.enum';

@ApiBearerAuth()
@ApiTags('workspace')
@Controller('workspace')
@UseGuards(RolesGuard)
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly projectService: ProjectService,
    private readonly apiDataService: ApiDataService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建空间' })
  @ApiCreatedResponseData(WorkspaceEntity)
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @User() user: IUser,
    @Body() createDto: CreateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.workspaceService.create(
      user.userId,
      createDto,
    );
    const project = workspace.projects.at(0);
    this.apiDataService.batchCreate(
      sampleApiData.map((item) => {
        Reflect.deleteProperty(item, 'uuid');
        Reflect.deleteProperty(item, 'uniqueID');
        return { ...item, projectID: project.uuid, project };
      }),
    );
    return workspace;
  }

  @ApiCreatedResponseData()
  @Post('upload')
  @ApiOperation({ summary: '导入本地数据并创建空间' })
  async importLocalData(@User() user: IUser, @Body() importDto: ImportDto) {
    const workspace = await this.workspaceService.create(user.userId, {
      title: '默认空间',
    });
    const exportResult = await this.projectService.import(
      workspace.id,
      workspace.projects.at(0).uuid,
      importDto,
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

  @Permissions(PermissionEnum.UPDATE_WORKSPACE)
  @ApiOkResponseData(WorkspaceEntity)
  @Put(':workspaceID')
  @ApiOperation({ summary: '修改空间名称' })
  async update(
    @Param('workspaceID', ParseIntPipe) id,
    @Body() updateDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    return this.workspaceService.update(id, updateDto);
  }

  @Permissions(PermissionEnum.DELETE_WORKSPACE)
  @ApiOkResponseData()
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

  @ApiOkResponseData(WorkspaceEntity, 'array')
  @Get('list')
  @ApiOperation({ summary: '获取空间列表' })
  list(@User() user: IUser): Promise<WorkspaceEntity[]> {
    return this.workspaceService.list(user.userId);
  }

  @ApiOkResponseData(WorkspaceEntity)
  @Get(':workspaceID')
  @ApiOperation({ summary: '获取空间信息' })
  async info(@Param('workspaceID') id): Promise<WorkspaceEntity> {
    const workspace = await this.workspaceService.findOne({
      where: { id },
      relations: ['projects'],
    });

    return workspace;
  }

  @ApiOkResponseData(WorkspaceUser, 'array')
  @Get(':workspaceID/member/list')
  @ApiOperation({ summary: '获取空间成员列表' })
  async getMemberList(@Param('workspaceID') id): Promise<WorkspaceUser[]> {
    return this.workspaceService.getMemberList(id);
  }

  @ApiOkResponseData(WorkspaceUser, 'array')
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

  @Permissions(PermissionEnum.ADD_WORKSPACE_MEMBER)
  @ApiCreatedResponseData(WorkspaceEntity)
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

  @Permissions(PermissionEnum.DELETE_WORKSPACE__MEMBER)
  @ApiOkResponseData(WorkspaceEntity)
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

  @ApiOkResponseData(WorkspaceEntity)
  @Post(':workspaceID/member/leave')
  @ApiOperation({ summary: '空间成员主动退出' })
  async memberLeave(
    @User() user: IUser,
    @Param('workspaceID') id,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.workspaceService.findOne({ where: { id } });
    if (!workspace) {
      throw new UnauthorizedException('空间不存在');
    }
    return this.workspaceService.removeMembers(id, [user.userId]);
  }

  @Post(':workspaceID/member/setRole')
  @ApiOperation({ summary: '设置空间成员角色' })
  async setMemberRole(@Param('workspaceID') id, @Body() dto: SetRoleDto) {
    return this.workspaceService.setMemberRole(id, dto);
  }

  @Get(':workspaceID/roles')
  @ApiOperation({ summary: '获取当前空间角色列表' })
  async getRoles(): Promise<RoleEntity[]> {
    return [];
  }

  @ApiOkResponseData(RolePermissionDto)
  @Get(':workspaceID/rolePermission')
  @ApiOperation({ summary: '获取当前用户在空间的角色和权限' })
  async getRolePermission(
    @User() user: IUser,
    @Param('workspaceID') workspaceID,
  ): Promise<RolePermissionDto> {
    return this.workspaceService.getRolePermission(user.userId, workspaceID);
  }
}

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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateDto } from './dto/create.dto';
import { SetRoleDto, UpdateDto } from './dto/update.dto';
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
import { IUser, User } from '@/common/decorators/user.decorator';
import {
  RolePermissionDto,
  WorkspaceMemberAddDto,
  WorkspaceMemberRemoveDto,
  WorkspaceUser,
} from '@/modules/workspace/workspace.dto';
import { RoleEntity } from '@/entities/role.entity';
import { UserEntity } from '@/entities/user.entity';
import { Permissions } from '@/common/decorators/permission.decorator';
import { PermissionEnum } from '@/enums/permission.enum';

@ApiTags('Project')
@Controller(`${WORKSPACE_ID_PREFIX}/project`)
@UseGuards(RolesGuard)
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @ApiCreatedResponseData(Project)
  @Post()
  async create(
    @User() user: IUser,
    @Param('workspaceID', ParseIntPipe) workspaceID,
    @Body() createDto: CreateDto,
  ) {
    const data = await this.service.create(createDto, workspaceID, user.userId);
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

  @Permissions(PermissionEnum.VIEW_PROJECT)
  @ApiOkResponseData(Project)
  @Get(':projectID')
  async findOne(
    @Param('projectID', ParseIntPipe) projectID,
    @Param('workspaceID', ParseIntPipe) workspaceID,
  ) {
    return this.service.findOne(workspaceID, projectID);
  }

  @Permissions(PermissionEnum.UPDATE_PROJECT)
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

  @Permissions(PermissionEnum.DELETE_PROJECT)
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

  @ApiOkResponseData(WorkspaceUser, 'array')
  @Get(':projectID/member/list')
  @ApiOperation({ summary: '获取项目成员列表' })
  async getMemberList(
    @Param('projectID', ParseIntPipe) projectID,
  ): Promise<WorkspaceUser[]> {
    return this.service.getMemberList(projectID);
  }

  @ApiOkResponseData(WorkspaceUser, 'array')
  @Get(':projectID/member/list/:username')
  @ApiOperation({ summary: '搜索项目成员' })
  @ApiResponse({
    type: [UserEntity],
  })
  async searchMemberByName(
    @Param('projectID', ParseIntPipe) id,
    @Param('username') username,
  ): Promise<WorkspaceUser[]> {
    return this.service.getMemberList(id, username);
  }

  @Permissions(PermissionEnum.ADD_PROJECT_MEMBER)
  @ApiCreatedResponseData(Project)
  @Post(':projectID/member/add')
  @ApiOperation({ summary: '添加项目成员' })
  async memberAdd(
    @User() user: IUser,
    @Param('projectID') projectID,
    @Body() addMemberDto: WorkspaceMemberAddDto,
  ) {
    return this.service.memberAdd(projectID, addMemberDto);
  }

  @Permissions(PermissionEnum.DELETE_PROJECT__MEMBER)
  @ApiOkResponseData(Project)
  @Delete(':projectID/member/remove')
  @ApiOperation({ summary: '移除项目成员' })
  async memberRemove(
    @User() user: IUser,
    @Param('projectID') id,
    @Body() createCatDto: WorkspaceMemberRemoveDto,
  ) {
    return this.service.memberRemove(id, createCatDto);
  }

  @ApiOkResponseData(Project)
  @Post(':projectID/member/leave')
  @ApiOperation({ summary: '项目成员主动退出' })
  async memberLeave(@User() user: IUser, @Param('projectID') id) {
    return this.service.memberLeave(user.userId, id);
  }

  @Post(':projectID/member/setRole')
  @ApiOperation({ summary: '设置项目成员角色' })
  async setMemberRole(@Param('projectID') projectID, @Body() dto: SetRoleDto) {
    return this.service.setProjectRole(projectID, dto);
  }

  @Get(':projectID/roles')
  @ApiOperation({ summary: '获取当前项目角色列表' })
  async getRoles(): Promise<RoleEntity[]> {
    return [];
  }

  @ApiOkResponseData(RolePermissionDto)
  @Get(':projectID/rolePermission')
  @ApiOperation({ summary: '获取当前用户在项目的角色和权限' })
  async getPermission(
    @User() user: IUser,
    @Param('projectID') projectID,
    @Param('workspaceID', ParseIntPipe) workspaceID,
  ): Promise<RolePermissionDto> {
    return this.service.getRolePermission(user.userId, projectID, workspaceID);
  }
}

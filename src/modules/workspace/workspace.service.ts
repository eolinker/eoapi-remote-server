import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions, In, Like, Repository } from 'typeorm';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceUser,
} from './workspace.dto';
import { WorkspaceEntity } from '@/entities/workspace.entity';
import { UserService } from '@/modules/user/user.service';
import { ProjectService } from '@/modules/workspace/project/project.service';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    private userService: UserService,
    private projectService: ProjectService,
  ) {}

  findOne(options: FindOneOptions<WorkspaceEntity>) {
    return this.workspaceRepository.findOne(options);
  }

  async create(
    creatorID: number,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    const creator = await this.userService.findOneBy({ id: creatorID });
    const project = await this.projectService.create({
      name: '默认项目',
      description: createWorkspaceDto.title + '默认项目',
    });
    console.log('creator', creator, project);
    return this.workspaceRepository.save({
      ...createWorkspaceDto,
      creatorID,
      users: [creator],
      projects: [project],
    });
  }

  async update(
    id: number,
    updateDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    await this.workspaceRepository.update(id, { title: updateDto.title });
    return this.workspaceRepository.findOneBy({ id });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.workspaceRepository.delete(id);
  }

  list(userId: number): Promise<WorkspaceEntity[]> {
    return this.workspaceRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
    });
  }

  async getMemberList(
    workspaceId: number,
    username = '',
  ): Promise<WorkspaceUser[]> {
    const [result] = await this.userService.findAndCount({
      where: {
        workspaces: {
          id: workspaceId,
        },
        username: Like(`%${username}%`),
      },
    });
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
    return result.map((item) => ({
      ...item,
      roleName: item.id === workspace.creatorID ? 'Owner' : 'Member',
    }));
  }

  async addMembers(workspaceId: number, userIDs: number[]) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: {
        users: true,
      },
    });
    const users = await this.userService.find({
      where: { id: In(userIDs) },
      relations: {
        workspaces: true,
      },
    });
    users.forEach((user) => {
      user.workspaces.push({
        ...workspace,
        users: [],
      });
    });
    workspace.users.push(...users);
    return this.workspaceRepository.save(workspace);
  }

  async removeMembers(workspaceId: number, userIDs: number[]) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: {
        users: true,
      },
    });
    workspace.users = workspace.users.filter(
      (user) => !userIDs.includes(user.id),
    );
    return this.workspaceRepository.save(workspace);
  }
}

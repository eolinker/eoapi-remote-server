import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { WorkspaceEntity } from './workspace.entity';
import { UserEntity } from './user.entity';
import { ApiData } from './apiData.entity';
import { ApiGroup } from './apiGroup.entity';
import { Environment } from './environment.entity';
import { ApiTestHistory } from './apiTestHistory.entity';
import { SharedEntity } from './shared.entity';

@Entity({ name: 'project' })
export class Project extends Base {
  @ApiProperty({ description: '项目所属空间' })
  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.projects, {
    onDelete: 'CASCADE',
  })
  workspace: WorkspaceEntity;

  @Exclude()
  @ApiHideProperty()
  @ManyToMany(() => UserEntity, (user) => user.projects)
  @JoinTable()
  users: UserEntity[];

  @ApiProperty({ description: '当前项目下的 apiData' })
  @Exclude()
  @OneToMany(() => ApiData, (apiData) => apiData.project)
  apiData: ApiData[];

  @ApiProperty({ description: '当前项目下的 apiGroup' })
  @Exclude()
  @OneToMany(() => ApiGroup, (apiGroup) => apiGroup.project)
  apiGroup: ApiGroup[];

  @ApiProperty({ description: '当前项目下的 apiTestHistory' })
  @Exclude()
  @OneToMany(() => ApiTestHistory, (apiTestHistory) => apiTestHistory.project)
  apiTestHistory: ApiGroup[];

  @ApiProperty({ description: '当前项目下的 environment' })
  @Exclude()
  @OneToMany(() => Environment, (environment) => environment.project)
  environment: Environment[];

  @ApiProperty({ description: '当前项目下的 shared' })
  @Exclude()
  @OneToMany(() => SharedEntity, (shared) => shared.project)
  shared: SharedEntity[];
}

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

  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => ApiData, (apiData) => apiData.project)
  apiData: ApiData[];

  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => ApiGroup, (apiGroup) => apiGroup.project)
  apiGroup: ApiGroup[];

  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => ApiTestHistory, (apiTestHistory) => apiTestHistory.project)
  apiTestHistory: ApiGroup[];

  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => Environment, (environment) => environment.project)
  environment: Environment[];

  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => SharedEntity, (shared) => shared.project)
  shared: SharedEntity[];
}

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { WorkspaceEntity } from './workspace.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'project' })
export class Project extends Base {
  @ApiProperty({ description: '项目所属空间' })
  @ManyToOne(() => WorkspaceEntity, (user) => user.projects, {
    onDelete: 'CASCADE',
  })
  workspace: WorkspaceEntity;

  @Exclude()
  @ApiHideProperty()
  @ManyToMany(() => UserEntity, (user) => user.projects)
  @JoinTable()
  users: UserEntity[];
}

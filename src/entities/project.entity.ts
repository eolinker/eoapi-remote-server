import { ApiProperty } from '@nestjs/swagger';
import { Entity, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { WorkspaceEntity } from './workspace.entity';

@Entity({ name: 'project' })
export class Project extends Base {
  @ApiProperty({ description: '项目所属空间' })
  @ManyToOne(() => WorkspaceEntity, (user) => user.projects, {
    onDelete: 'CASCADE',
  })
  workspace: WorkspaceEntity;
}

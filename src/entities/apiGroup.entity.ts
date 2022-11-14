import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from './project.entity';
import { Base } from './base.entity';

@Entity({ name: 'api_group' })
export class ApiGroup extends Base {
  @Column({ default: 0 })
  projectID: number;

  @Column({ default: 0 })
  parentID: number;

  @Column({ default: 0 })
  weight: number;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => Project, (project) => project.apiGroup, {
    onDelete: 'CASCADE',
  })
  project: Project;
}

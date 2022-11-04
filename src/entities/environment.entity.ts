import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { Base } from './base.entity';

@Entity({ name: 'environment' })
export class Environment extends Base {
  @Column({ default: 0 })
  projectID: number;

  @Column()
  hostUri: string;

  @Column({ type: 'json', nullable: true })
  parameters: string;

  @Exclude()
  @ManyToOne(() => Project, (project) => project.environment, {
    onDelete: 'CASCADE',
  })
  project: Project;
}

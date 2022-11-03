import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { OperatorBase } from './base.entity';

@Entity({ name: 'api_test_history' })
export class ApiTestHistory extends OperatorBase {
  @Column({ default: 0 })
  projectID: number;

  @Column({ nullable: true })
  apiDataID: number;

  @Column({ type: 'json' })
  general: string;

  @Column({ type: 'json' })
  request: string;

  @Column({ type: 'json' })
  response: string;

  @Exclude()
  @ManyToOne(() => Project, (project) => project.apiTestHistory, {
    onDelete: 'CASCADE',
  })
  project: Project;
}

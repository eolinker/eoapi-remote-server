import { Exclude } from 'class-transformer';
import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { FictitiousBase } from './base.entity';

@Entity({ name: 'shared' })
export class SharedEntity extends FictitiousBase {
  @Column()
  @Generated('uuid')
  uniqueID: string;

  @Column()
  projectID: number;

  @Exclude()
  @ManyToOne(() => Project, (project) => project.shared, {
    onDelete: 'CASCADE',
  })
  project: Project;
}

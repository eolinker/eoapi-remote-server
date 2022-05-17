import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class ApiGroup extends Base {
  @Column()
  projectID: number;

  @Column()
  parentID: number;

  @Column()
  weight: number;
}

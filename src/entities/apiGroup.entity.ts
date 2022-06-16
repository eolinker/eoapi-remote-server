import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'api_group' })
export class ApiGroup extends Base {
  @Column()
  projectID: number;

  @Column()
  parentID: number;

  @Column()
  weight: number;
}

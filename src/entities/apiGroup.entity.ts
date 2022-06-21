import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'api_group' })
export class ApiGroup extends Base {
  @Column({ default: 0 })
  projectID: number;

  @Column({ default: 0 })
  parentID: number;

  @Column({default:0})
  weight: number;
}

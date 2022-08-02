import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'mock' })
export class Mock extends Base {
  @Column({ default: 0 })
  projectID: number;

  @Column()
  apiDataID: number;

  @Column({ type: 'longtext' })
  response: string;

  @Column()
  createWay: string;
}

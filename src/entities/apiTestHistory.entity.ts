import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class ApiTestHistory extends Base {
  @Column()
  projectID: number;

  @Column()
  apiDataID: number;

  @Column()
  general: string;

  @Column()
  request: string;

  @Column()
  response: string;

  @Column()
  weight: number;
}

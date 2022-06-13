import { Column, Entity } from 'typeorm';
import { FictitiousBase } from './base.entity';

@Entity()
export class ApiTestHistory extends FictitiousBase {
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
}

import { Column, Entity, TableColumnOptions } from 'typeorm';
import { FictitiousBase } from './base.entity';

@Entity({ name: 'api_test_history' })
export class ApiTestHistory extends FictitiousBase {
  @Column({ default: 0 })
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

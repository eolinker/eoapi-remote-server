import { Column, Entity, TableColumnOptions } from 'typeorm';
import { FictitiousBase } from './base.entity';

@Entity({ name: 'api_test_history' })
export class ApiTestHistory extends FictitiousBase {
  @Column({ default: 0 })
  projectID: number;

  @Column()
  apiDataID: number;

  @Column({ type: 'simple-json' })
  general: string;

  @Column({ type: 'simple-json' })
  request: string;

  @Column({ type: 'simple-json' })
  response: string;
}

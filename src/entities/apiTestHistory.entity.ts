import { Column, Entity } from 'typeorm';
import { FictitiousBase } from './base.entity';

@Entity({ name: 'api_test_history' })
export class ApiTestHistory extends FictitiousBase {
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
}

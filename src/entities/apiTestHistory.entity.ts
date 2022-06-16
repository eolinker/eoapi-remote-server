import { Column, Entity, TableColumnOptions } from 'typeorm';
import { FictitiousBase } from './base.entity';

@Entity({ name: 'api_test_history' })
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
export const APITestHistoryColumn: TableColumnOptions[] = [
  {
    name: 'uuid',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
    comment: 'increment primary key',
  },
  {
    name: 'projectID',
    type: 'int',
    default: 0,
    comment: 'project primary key',
  },
  {
    name: 'apiDataID',
    type: 'int',
    default: 0,
    comment: 'Api数据ID',
  },
  {
    name: 'general',
    type: 'json',
    isNullable: true,
    comment: 'General indicators',
  },
  {
    name: 'request',
    type: 'json',
    isNullable: true,
    comment: 'HTTP Request',
  },
  {
    name: 'response',
    type: 'json',
    isNullable: true,
    comment: 'HTTP response',
  },
  {
    name: 'createdAt',
    type: 'timestamp',
    default: 'current_timestamp',
  },
  {
    name: 'updatedAt',
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: 'current_timestamp',
  },
];

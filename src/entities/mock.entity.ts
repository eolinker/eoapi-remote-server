import { Column, Entity, TableColumnOptions } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'mock' })
export class Mock extends Base {
  @Column()
  projectID: number;

  @Column()
  apiDataID: number;

  @Column()
  response: string;
}

export const MockColumn: TableColumnOptions[] = [
  {
    name: 'uuid',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
    comment: 'increment primary key',
  },
  {
    name: 'name',
    type: 'text',
    isNullable: true,
    comment: 'Mock name',
  },
  {
    name: 'description',
    type: 'text',
    isNullable: true,
    comment: 'Mock description',
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
    comment: 'API ID',
  },
  {
    name: 'response',
    type: 'text',
    isNullable: true,
    comment: 'Mock response data',
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

import { Column, Entity, Generated, TableColumnOptions } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class ApiData extends Base {
  @Column()
  @Generated('uuid')
  uniqueID: string;

  @Column()
  projectID: number;

  @Column()
  groupID: number;

  @Column()
  uri: string;

  @Column()
  protocol: string;

  @Column()
  method: string;

  @Column()
  requestBodyType: string;

  @Column()
  requestHeaders: string;

  @Column()
  requestBodyJsonType: string;

  @Column()
  requestBody: string;

  @Column()
  queryParams: string;

  @Column()
  restParams: string;

  @Column()
  responseHeaders: string;

  @Column()
  responseBody: string;

  @Column()
  responseBodyType: string;

  @Column()
  responseBodyJsonType: string;

  @Column()
  weight: number;
}

export const ApiDataColumn: TableColumnOptions[] = [
  {
    name: 'uuid',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
    comment: 'increment primary key',
  },
  {
    name: 'uniqueID',
    type: 'varchar',
    length: '100',
    isGenerated: true,
    generationStrategy: 'uuid',
    comment: 'uniqueID',
  },
  {
    name: 'name',
    type: 'varchar',
    length: '100',
    comment: 'API name',
  },
  {
    name: 'description',
    type: 'text',
    isNullable: true,
    comment: 'API description',
  },
  {
    name: 'projectID',
    type: 'int',
    default: 0,
    comment: 'project primary key',
  },
  {
    name: 'groupID',
    type: 'int',
    default: 0,
    comment: 'group ID',
  },
  {
    name: 'uri',
    type: 'varchar',
    comment: 'request url',
  },
  {
    name: 'protocol',
    type: 'varchar',
    length: '20',
    comment: 'API protocol',
  },
  {
    name: 'method',
    type: 'varchar',
    length: '20',
    comment: 'API request method',
  },
  {
    name: 'requestBodyType',
    type: 'varchar',
    length: '20',
    comment: 'API request body type',
  },
  {
    name: 'requestHeaders',
    type: 'json',
    isNullable: true,
    comment: 'request header',
  },
  {
    name: 'requestBodyJsonType',
    type: 'varchar',
    length: '20',
    comment: 'request body json type',
  },
  {
    name: 'requestBody',
    type: 'json',
    isNullable: true,
    comment: 'request body,may has level',
  },
  {
    name: 'queryParams',
    type: 'json',
    isNullable: true,
    comment: 'get/query params',
  },
  {
    name: 'restParams',
    type: 'json',
    isNullable: true,
    comment: 'rest params',
  },
  {
    name: 'responseHeaders',
    type: 'json',
    isNullable: true,
    comment: 'response header',
  },
  {
    name: 'responseBody',
    type: 'json',
    isNullable: true,
    comment: 'request body,may has level',
  },
  {
    name: 'responseBodyType',
    type: 'varchar',
    length: '20',
    comment: 'response body type',
  },
  {
    name: 'responseBodyJsonType',
    type: 'varchar',
    length: '20',
    comment: 'respinse body json type',
  },
  {
    name: 'weight',
    type: 'int',
    default: 0,
    comment: 'order weight',
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

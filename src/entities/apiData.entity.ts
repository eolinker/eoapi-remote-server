import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class ApiData extends Base {
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

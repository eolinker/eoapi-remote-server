import { Column, Entity, Generated } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'api_data' })
export class ApiData extends Base {
  @Column()
  @Generated('uuid')
  uniqueID: string;

  @Column({ default: 0 })
  projectID: number;

  @Column({ default: 0 })
  groupID: number;

  @Column()
  uri: string;

  @Column()
  protocol: string;

  @Column()
  method: string;

  @Column()
  requestBodyType: string;

  @Column({ type: 'json' })
  requestHeaders: string;

  @Column()
  requestBodyJsonType: string;

  @Column({ type: 'json' })
  requestBody: string;

  @Column({ type: 'json' })
  queryParams: string;

  @Column({ type: 'json' })
  restParams: string;

  @Column({ type: 'json' })
  responseHeaders: string;

  @Column({ type: 'json' })
  responseBody: string;

  @Column()
  responseBodyType: string;

  @Column()
  responseBodyJsonType: string;

  @Column({ default: 0 })
  weight: number;
}

import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiData } from './apiData.entity';
import { Base } from './base.entity';

@Entity({ name: 'mock' })
export class Mock extends Base {
  @Column({ default: 0 })
  projectID: number;

  @Column()
  apiDataID: number;

  @Column({ type: 'json' })
  response: string;

  @Column()
  createWay: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => ApiData, (apiData) => apiData.mock, {
    onDelete: 'CASCADE',
  })
  apiData: ApiData;
}

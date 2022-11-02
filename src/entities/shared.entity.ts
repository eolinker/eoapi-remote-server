import { Column, Entity, Generated } from 'typeorm';
import { FictitiousBase } from './base.entity';

@Entity({ name: 'shared' })
export class SharedEntity extends FictitiousBase {
  @Column()
  @Generated('uuid')
  uniqueID: string;

  @Column()
  projectID: number;
}

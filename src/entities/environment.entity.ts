import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Environment extends Base {
  @Column()
  projectID: number;

  @Column()
  hostUri: string;

  @Column()
  parameters: string;
}

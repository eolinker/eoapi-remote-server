import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'environment' })
export class Environment extends Base {
  @Column({ default: 0 })
  projectID: number;

  @Column()
  hostUri: string;

  @Column({ type: 'json', nullable: true })
  parameters: string;
}

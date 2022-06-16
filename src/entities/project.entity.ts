import { Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'project' })
export class Project extends Base {}

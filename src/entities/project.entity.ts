import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'project' })
export class Project extends Base {
  @ApiProperty({ description: '空间ID' })
  workspaceID: number;
}

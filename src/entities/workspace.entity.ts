import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserEntity } from './user.entity';

@Entity({ name: 'workspace' })
export class WorkspaceEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty({ example: '在线空间1', description: '空间名称' })
  title: string;

  @Column()
  @ApiProperty({ example: 'scar', description: '空间创建者ID' })
  creatorID: number;

  @Exclude()
  @ApiHideProperty()
  @ManyToMany(() => UserEntity, (user) => user.workspaces)
  @JoinTable()
  users: UserEntity[];
}

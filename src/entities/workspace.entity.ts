import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '@/entities/user.entity';

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

  @ManyToMany(() => UserEntity, (user) => user.workspaces)
  @JoinTable()
  users: UserEntity[];
}

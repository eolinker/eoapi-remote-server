import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceEntity } from './workspace.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty({ example: '路飞', description: '用户名' })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', select: false })
  @ApiProperty({ example: '123456', description: '密码' })
  password: string;

  @Column({ type: 'int', nullable: true, default: 1, select: false })
  @ApiHideProperty()
  @Exclude()
  @ApiProperty({ example: 1, description: '密码版本' })
  passwordVersion: number;

  @Column({ nullable: true })
  @ApiProperty({ example: 'url', description: '用户头像' })
  avatar?: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToMany(() => WorkspaceEntity, (workspace) => workspace.users)
  workspaces: WorkspaceEntity[];
}

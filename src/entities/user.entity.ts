import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsMobilePhone, IsString } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceEntity } from './workspace.entity';
import { TimestampBase } from './base.entity';
import { Project } from './project.entity';

@Entity({ name: 'user' })
export class UserEntity extends TimestampBase {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty({ example: '路飞', description: '用户名' })
  username: string;

  @ApiProperty({ description: '手机号码' })
  @IsMobilePhone('zh-CN')
  @Column({ nullable: true })
  mobilePhone: string;

  @ApiProperty({ example: 'scar@eolink.com', description: '邮箱' })
  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Exclude()
  @Column({ type: 'varchar', select: false })
  @ApiHideProperty()
  @ApiProperty({ example: '123456', description: '密码' })
  password: string;

  @Column({ type: 'int', nullable: true, default: 1, select: false })
  @ApiHideProperty()
  @Exclude()
  @ApiProperty({ example: 1, description: '密码版本' })
  passwordVersion: number;

  @Column({ nullable: true })
  @IsString()
  @ApiProperty({ example: 'url', description: '用户头像' })
  avatar: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToMany(() => WorkspaceEntity, (workspace) => workspace.users)
  workspaces: WorkspaceEntity[];

  @ApiHideProperty()
  @Exclude()
  @ManyToMany(() => Project, (project) => project.users)
  projects: Project[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.new.entity';

@Entity({ name: 'permission' })
export class Permission extends BaseEntity {
  @ApiProperty({ type: String, description: '权限名称' })
  @Column({ type: 'varchar', length: 120, comment: '权限名称' })
  name: string;

  @ApiProperty({ type: Number, description: '权限状态' })
  @Column({
    type: 'tinyint',
    width: 1,
    default: 1,
    comment: '状态：0=禁用 1=启用',
  })
  status: number;
}

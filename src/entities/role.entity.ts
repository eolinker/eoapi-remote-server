import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.new.entity';

@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '角色名称',
  })
  name: string;

  @Column({
    type: 'tinyint',
    width: 1,
    unsigned: true,
    comment: '角色类别: 1=空间 2=项目',
  })
  module: number;

  @Column({ type: 'varchar', length: 200, default: '', comment: '角色备注' })
  remark: string;
}

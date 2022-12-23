import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.new.entity';

@Entity({ name: 'role_permission' })
export class RolePermissionEntity extends BaseEntity {
  @Column({ type: 'int', name: 'role_id', unsigned: true, comment: '角色ID' })
  roleID: number;

  @Column({
    type: 'int',
    name: 'permission_id',
    comment: '权限ID',
  })
  permissionID: number;
}

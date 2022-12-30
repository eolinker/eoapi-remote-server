import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.new.entity';

@Entity({ name: 'workspace_user_role' })
export class WorkspaceUserRoleEntity extends BaseEntity {
  @Column({
    name: 'workspace_id',
    type: 'int',
    comment: '空间ID',
  })
  workspaceID: number;

  @Column({
    name: 'user_id',
    type: 'int',
    comment: '用户ID',
  })
  userID: number;

  @Column({ name: 'role_id', type: 'int', comment: '角色ID' })
  roleID: number;
}

import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.new.entity';

@Entity({ name: 'project_user_role' })
export class ProjectUserRoleEntity extends BaseEntity {
  @Column({
    name: 'project_id',
    type: 'int',
    comment: '项目ID',
  })
  projectID: number;

  @Column({
    name: 'user_id',
    type: 'int',
    comment: '用户ID',
  })
  userID: number;

  @Column({ name: 'role_id', type: 'int', comment: '角色ID' })
  roleID: number;
}

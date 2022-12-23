import { MigrationInterface, QueryRunner } from 'typeorm';
import { PermissionEntity } from '@/entities/permission.entity';
import { RoleEntity } from '@/entities/role.entity';
import { PermissionEnum } from '@/enums/permission.enum';
import { RolePermissionEntity } from '@/entities/role-permission.entity';

const perms = Object.values(PermissionEnum);

const workspaceOwnerPerms = [
  'update:workspace',
  'delete:workspace',
  'view:workspace',
  'add:workspace:member',
  'update:workspace:member',
  'delete:workspace:member',
  'view:project:list',
  'view:project',
  'update:project',
  'delete:project',
  'add:project:member',
  'update:project:member',
  'delete:project:member',
];

export class updateTable11101671725826115 implements MigrationInterface {
  name = 'updateTable11101671725826115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permission\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`name\` varchar(120) NOT NULL COMMENT '权限名称', \`status\` tinyint(1) NOT NULL COMMENT '状态：0=禁用 1=启用' DEFAULT '1', UNIQUE INDEX \`IDX_240853a0c3353c25fb12434ad3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permission\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`role_id\` int UNSIGNED NOT NULL COMMENT '角色ID', \`permission_id\` int NOT NULL COMMENT '权限ID', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project_user_role\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`project_id\` int NOT NULL COMMENT '项目ID', \`user_id\` int NOT NULL COMMENT '用户ID', \`role_id\` int NOT NULL COMMENT '角色ID', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workspace_user_role\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`workspace_id\` int NOT NULL COMMENT '空间ID', \`user_id\` int NOT NULL COMMENT '用户ID', \`role_id\` int NOT NULL COMMENT '角色ID', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`name\` varchar(50) NOT NULL COMMENT '角色名称', \`module\` tinyint(1) UNSIGNED NOT NULL COMMENT '角色类别: 1=空间 2=项目', \`remark\` varchar(200) NOT NULL COMMENT '角色备注' DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    // 初始化权限
    await queryRunner.manager.insert<PermissionEntity>(
      'permission',
      perms.map((name) => ({ name })),
    );

    // 初始化默认角色
    const roleInsertResult = await queryRunner.manager.insert<RoleEntity>(
      'role',
      [
        {
          name: 'Owner',
          module: 1,
          remark: 'workspace owner',
        },
        {
          name: 'Editor',
          module: 1,
          remark: 'workspace editor',
        },
        {
          name: 'Owner',
          module: 2,
          remark: 'project owner',
        },
        {
          name: 'Editor',
          module: 2,
          remark: 'project editor',
        },
      ],
    );

    const [wOwner, wEditor, pOwner, pEditor] = roleInsertResult.identifiers;

    for (const wPerm of workspaceOwnerPerms) {
      const perm = await queryRunner.manager.findOneBy<PermissionEntity>(
        'permission',
        { name: wPerm },
      );
      await queryRunner.manager.insert<RolePermissionEntity>(
        'role_permission',
        {
          roleID: wOwner.id,
          permissionID: perm.id,
        },
      );
      // workspace editor 没有删除或移除操作
      if (
        ![
          'delete',
          'remove',
          'add:workspace:member',
          'update:workspace:member',
        ].some((n) => perm.name.includes(n))
      ) {
        await queryRunner.manager.insert<RolePermissionEntity>(
          'role_permission',
          {
            roleID: wEditor.id,
            permissionID: perm.id,
          },
        );
      }
    }

    for (const name of perms) {
      if (name.includes('workspace')) {
        continue;
      }
      const perm = await queryRunner.manager.findOneBy<PermissionEntity>(
        'permission',
        { name },
      );
      await queryRunner.manager.insert<RolePermissionEntity>(
        'role_permission',
        {
          roleID: pOwner.id,
          permissionID: perm.id,
        },
      );
      // project editor 没有删除或更新项目操作
      if (
        ![
          'update:project',
          'delete:project',
          'update:project:member',
          'delete:project:member',
        ].some((n) => n === name)
      ) {
        await queryRunner.manager.insert<RolePermissionEntity>(
          'role_permission',
          {
            roleID: pEditor.id,
            permissionID: perm.id,
          },
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`workspace_user_role\``);
    await queryRunner.query(`DROP TABLE \`project_user_role\``);
    await queryRunner.query(`DROP TABLE \`role_permission\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_240853a0c3353c25fb12434ad3\` ON \`permission\``,
    );
    await queryRunner.query(`DROP TABLE \`permission\``);
  }
}

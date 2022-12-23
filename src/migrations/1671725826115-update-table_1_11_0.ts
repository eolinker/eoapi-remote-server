import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable11101671725826115 implements MigrationInterface {
    name = 'updateTable11101671725826115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permission\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`name\` varchar(120) NOT NULL COMMENT '权限名称', \`status\` tinyint(1) NOT NULL COMMENT '状态：0=禁用 1=启用' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_user_role\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`project_id\` int NOT NULL COMMENT '项目ID', \`user_id\` int NOT NULL COMMENT '用户ID', \`role_id\` int NOT NULL COMMENT '角色ID', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_permission\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`role_id\` int UNSIGNED NOT NULL COMMENT '角色ID', \`permission_id\` int NOT NULL COMMENT '权限ID', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`name\` varchar(50) NOT NULL COMMENT '角色名称', \`module\` tinyint(1) UNSIGNED NOT NULL COMMENT '角色类别: 1=空间 2=项目', \`remark\` varchar(200) NOT NULL COMMENT '角色备注' DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workspace_user_role\` (\`created_at\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '删除时间', \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`uuid\` varchar(36) NOT NULL COMMENT '业务 UUID', \`create_by\` bigint NULL COMMENT '创建者', \`update_by\` bigint NULL COMMENT '更新者', \`workspace_id\` int NOT NULL COMMENT '空间ID', \`user_id\` int NOT NULL COMMENT '用户ID', \`role_id\` int NOT NULL COMMENT '角色ID', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`workspace_user_role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`role_permission\``);
        await queryRunner.query(`DROP TABLE \`project_user_role\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1911667468092538 implements MigrationInterface {
    name = 'updateTable1911667468092538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginTime\` \`lastLoginTime\` timestamp NOT NULL DEFAULT Thu Nov 03 2022 17:34:56 GMT+0800 (中国标准时间)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginTime\` \`lastLoginTime\` timestamp NOT NULL`);
    }

}

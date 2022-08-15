import {MigrationInterface, QueryRunner} from "typeorm";

export class upgradeTable1660549006923 implements MigrationInterface {
    name = 'upgradeTable1660549006923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`general\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`general\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`request\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`request\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`response\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`response\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`request\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`request\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`general\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`general\` longtext NOT NULL`);
    }

}

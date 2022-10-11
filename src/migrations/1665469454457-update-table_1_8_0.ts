import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1801665469454457 implements MigrationInterface {
    name = 'updateTable1801665469454457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_test_history\` CHANGE \`apiDataID\` \`apiDataID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`general\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`general\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`request\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`request\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`response\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`response\` json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`response\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`response\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`request\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`request\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`general\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`general\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` CHANGE \`apiDataID\` \`apiDataID\` int NOT NULL`);
    }

}

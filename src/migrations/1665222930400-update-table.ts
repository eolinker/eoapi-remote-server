import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1665222930400 implements MigrationInterface {
    name = 'updateTable1665222930400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_test_history\` CHANGE \`apiDataID\` \`apiDataID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`response\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`response\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` CHANGE \`apiDataID\` \`apiDataID\` int NOT NULL`);
    }

}

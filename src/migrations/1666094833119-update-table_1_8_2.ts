import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1821666094833119 implements MigrationInterface {
    name = 'updateTable1821666094833119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`createBy\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`createBy\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`updateBy\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`updateBy\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`updateBy\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`updateBy\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`createBy\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`createBy\` varchar(255) NOT NULL`);
    }

}

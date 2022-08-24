import {MigrationInterface, QueryRunner} from "typeorm";

export class upgradeTable1661310730557 implements MigrationInterface {
    name = 'upgradeTable1661310730557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`requestBody\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`requestBody\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`responseBody\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`responseBody\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`responseBody\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`responseBody\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`requestBody\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`requestBody\` longtext NULL`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1911667468271904 implements MigrationInterface {
    name = 'updateTable1911667468271904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`lastLoginTime\` timestamp NULL DEFAULT Thu Nov 03 2022 17:37:57 GMT+0800 (中国标准时间)`);
        await queryRunner.query(`ALTER TABLE \`api_group\` ADD \`projectUuid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`environment\` ADD \`projectUuid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`projectUuid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shared\` ADD \`projectUuid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`apiDataUuid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`projectUuid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`api_group\` ADD CONSTRAINT \`FK_4c9f998ae6bc89ef7a5ad3d9d3c\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`project\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`environment\` ADD CONSTRAINT \`FK_eb347c0e0647044122bf5a837ad\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`project\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD CONSTRAINT \`FK_c5c21e17151420d32a003983f15\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`project\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shared\` ADD CONSTRAINT \`FK_5261cf174dbbaf80ded486b90a5\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`project\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD CONSTRAINT \`FK_369b5e31d6e3ac04039542b92e5\` FOREIGN KEY (\`apiDataUuid\`) REFERENCES \`api_data\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD CONSTRAINT \`FK_2e2745ab4ece582a653c8092901\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`project\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP FOREIGN KEY \`FK_2e2745ab4ece582a653c8092901\``);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP FOREIGN KEY \`FK_369b5e31d6e3ac04039542b92e5\``);
        await queryRunner.query(`ALTER TABLE \`shared\` DROP FOREIGN KEY \`FK_5261cf174dbbaf80ded486b90a5\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP FOREIGN KEY \`FK_c5c21e17151420d32a003983f15\``);
        await queryRunner.query(`ALTER TABLE \`environment\` DROP FOREIGN KEY \`FK_eb347c0e0647044122bf5a837ad\``);
        await queryRunner.query(`ALTER TABLE \`api_group\` DROP FOREIGN KEY \`FK_4c9f998ae6bc89ef7a5ad3d9d3c\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`projectUuid\``);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`apiDataUuid\``);
        await queryRunner.query(`ALTER TABLE \`shared\` DROP COLUMN \`projectUuid\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`projectUuid\``);
        await queryRunner.query(`ALTER TABLE \`environment\` DROP COLUMN \`projectUuid\``);
        await queryRunner.query(`ALTER TABLE \`api_group\` DROP COLUMN \`projectUuid\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastLoginTime\``);
    }

}

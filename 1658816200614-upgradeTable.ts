import { MigrationInterface, QueryRunner } from "typeorm";

export class upgradeTable1658816200614 implements MigrationInterface {
    name = 'upgradeTable1658816200614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`api_group\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`api_group\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`api_group\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`api_group\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`environment\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`environment\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`environment\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`environment\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mock\` CHANGE \`conditions\` \`conditions\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mock\` CHANGE \`conditions\` \`conditions\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`updatedAt\` timestamp(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`createdAt\` timestamp(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`environment\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`environment\` ADD \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`environment\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`environment\` ADD \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`api_group\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`api_group\` ADD \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`api_group\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`api_group\` ADD \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`api_data\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` ADD \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

}

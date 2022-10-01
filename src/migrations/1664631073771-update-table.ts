import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1664631073771 implements MigrationInterface {
    name = 'updateTable1664631073771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_c224ab17df530651e53a398ed92\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`workspace\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`workspace\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`api_data\` CHANGE \`requestBody\` \`requestBody\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_data\` CHANGE \`responseBody\` \`responseBody\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_c224ab17df530651e53a398ed92\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_c224ab17df530651e53a398ed92\``);
        await queryRunner.query(`ALTER TABLE \`api_data\` CHANGE \`responseBody\` \`responseBody\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`api_data\` CHANGE \`requestBody\` \`requestBody\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`workspace\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`workspace\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_c224ab17df530651e53a398ed92\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

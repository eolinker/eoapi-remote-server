import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1811665660716453 implements MigrationInterface {
    name = 'updateTable1811665660716453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_test_history\` CHANGE \`general\` \`general\` json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_test_history\` CHANGE \`general\` \`general\` json NULL`);
    }

}

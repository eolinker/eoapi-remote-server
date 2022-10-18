import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1821666095643523 implements MigrationInterface {
    name = 'updateTable1821666095643523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project_users_user\` (\`projectUuid\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_6a2f9d94e82e85ba623237023b\` (\`projectUuid\`), INDEX \`IDX_f8300efd87679e1e21532be980\` (\`userId\`), PRIMARY KEY (\`projectUuid\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`createBy\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` ADD \`updateBy\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`project_users_user\` ADD CONSTRAINT \`FK_6a2f9d94e82e85ba623237023bd\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`project\`(\`uuid\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`project_users_user\` ADD CONSTRAINT \`FK_f8300efd87679e1e21532be9808\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_users_user\` DROP FOREIGN KEY \`FK_f8300efd87679e1e21532be9808\``);
        await queryRunner.query(`ALTER TABLE \`project_users_user\` DROP FOREIGN KEY \`FK_6a2f9d94e82e85ba623237023bd\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`updateBy\``);
        await queryRunner.query(`ALTER TABLE \`api_test_history\` DROP COLUMN \`createBy\``);
        await queryRunner.query(`DROP INDEX \`IDX_f8300efd87679e1e21532be980\` ON \`project_users_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a2f9d94e82e85ba623237023b\` ON \`project_users_user\``);
        await queryRunner.query(`DROP TABLE \`project_users_user\``);
    }

}

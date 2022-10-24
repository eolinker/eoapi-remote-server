import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1901666542497812 implements MigrationInterface {
    name = 'updateTable1901666542497812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`shared\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`uuid\` int NOT NULL AUTO_INCREMENT, \`uniqueID\` varchar(36) NOT NULL, \`projectID\` int NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`shared\``);
    }

}

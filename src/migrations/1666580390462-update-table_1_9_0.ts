import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1901666580390462 implements MigrationInterface {
  name = 'updateTable1901666580390462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`shared\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`uuid\` int NOT NULL AUTO_INCREMENT, \`uniqueID\` varchar(36) NOT NULL, \`projectID\` int NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_group\` modify column  \`name\` varchar(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`environment\` modify column \`name\` varchar(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` modify column \`name\` varchar(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mock\` modify column \`name\` varchar(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_data\` modify column \`name\` varchar(500) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`api_data\` modify column \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mock\` modify column \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` modify column \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`environment\` modify column \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_group\` modify column \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE \`shared\``);
  }
}

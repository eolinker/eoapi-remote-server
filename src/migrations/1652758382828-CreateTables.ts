import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTable1652758382828 implements MigrationInterface {
  name = 'createTable1652758382828';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`api_data\` (\`uuid\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`uniqueID\` varchar(36) NOT NULL, \`projectID\` int NOT NULL DEFAULT '0', \`groupID\` int NOT NULL DEFAULT '0', \`uri\` varchar(255) NOT NULL, \`protocol\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL, \`requestBodyType\` varchar(255) NOT NULL, \`requestHeaders\` json NOT NULL, \`requestBodyJsonType\` varchar(255) NOT NULL, \`requestBody\` json NOT NULL, \`queryParams\` json NOT NULL, \`restParams\` json NOT NULL, \`responseHeaders\` json NOT NULL, \`responseBody\` json NOT NULL, \`responseBodyType\` varchar(255) NOT NULL, \`responseBodyJsonType\` varchar(255) NOT NULL, \`weight\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`api_group\` (\`uuid\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`projectID\` int NOT NULL DEFAULT '0', \`parentID\` int NOT NULL DEFAULT '0', \`weight\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`api_test_history\` (\`uuid\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, \`projectID\` int NOT NULL DEFAULT '0', \`apiDataID\` int NOT NULL, \`general\` varchar(255) NOT NULL, \`request\` varchar(255) NOT NULL, \`response\` varchar(255) NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`environment\` (\`uuid\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`projectID\` int NOT NULL DEFAULT '0', \`hostUri\` varchar(255) NOT NULL, \`parameters\` json NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mock\` (\`uuid\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`projectID\` int NOT NULL DEFAULT '0', \`apiDataID\` int NOT NULL, \`response\` varchar(255) NOT NULL, \`createWay\` varchar(255) NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project\` (\`uuid\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`project\``);
    await queryRunner.query(`DROP TABLE \`mock\``);
    await queryRunner.query(`DROP TABLE \`environment\``);
    await queryRunner.query(`DROP TABLE \`api_test_history\``);
    await queryRunner.query(`DROP TABLE \`api_group\``);
    await queryRunner.query(`DROP TABLE \`api_data\``);
  }
}

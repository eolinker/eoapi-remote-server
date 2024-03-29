import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1664727097056 implements MigrationInterface {
  name = 'updateTable1664727097056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE api_data SET requestBody='[]' WHERE requestBody IS NULL`,
    );
    await queryRunner.query(
      `UPDATE api_data SET responseBody='[]' WHERE responseBody IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workspace\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`creatorID\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`mobilePhone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`passwordVersion\` int NULL DEFAULT '1', \`avatar\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth\` (\`id\` int NOT NULL AUTO_INCREMENT, \`accessToken\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`refreshTokenExpiresAt\` bigint NOT NULL, \`userId\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workspace_users_user\` (\`workspaceId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_e560bebe0dad802fbb036ba878\` (\`workspaceId\`), INDEX \`IDX_ff70af68685d8a5d6b588dfdc5\` (\`userId\`), PRIMARY KEY (\`workspaceId\`, \`userId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`workspaceId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_data\` CHANGE \`requestBody\` \`requestBody\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_data\` CHANGE \`responseBody\` \`responseBody\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD CONSTRAINT \`FK_c224ab17df530651e53a398ed92\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD CONSTRAINT \`FK_373ead146f110f04dad60848154\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`workspace_users_user\` ADD CONSTRAINT \`FK_e560bebe0dad802fbb036ba8788\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`workspace_users_user\` ADD CONSTRAINT \`FK_ff70af68685d8a5d6b588dfdc5b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE api_data SET requestBody='[]' WHERE requestBody IS NULL`,
    );
    await queryRunner.query(
      `UPDATE api_data SET responseBody='[]' WHERE responseBody IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`workspace_users_user\` DROP FOREIGN KEY \`FK_ff70af68685d8a5d6b588dfdc5b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`workspace_users_user\` DROP FOREIGN KEY \`FK_e560bebe0dad802fbb036ba8788\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_373ead146f110f04dad60848154\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_c224ab17df530651e53a398ed92\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_data\` CHANGE \`responseBody\` \`responseBody\` json NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_data\` CHANGE \`requestBody\` \`requestBody\` json NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP COLUMN \`workspaceId\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ff70af68685d8a5d6b588dfdc5\` ON \`workspace_users_user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e560bebe0dad802fbb036ba878\` ON \`workspace_users_user\``,
    );
    await queryRunner.query(`DROP TABLE \`workspace_users_user\``);
    await queryRunner.query(`DROP TABLE \`auth\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`workspace\``);
  }
}

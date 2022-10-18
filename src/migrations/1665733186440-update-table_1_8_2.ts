import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1821665733186440 implements MigrationInterface {
  name = 'updateTable1821665733186440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`project_users_user\` (\`projectUuid\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_6a2f9d94e82e85ba623237023b\` (\`projectUuid\`), INDEX \`IDX_f8300efd87679e1e21532be980\` (\`userId\`), PRIMARY KEY (\`projectUuid\`, \`userId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_test_history\` CHANGE \`general\` \`general\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_users_user\` ADD CONSTRAINT \`FK_6a2f9d94e82e85ba623237023bd\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`project\`(\`uuid\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_users_user\` ADD CONSTRAINT \`FK_f8300efd87679e1e21532be9808\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    const workspaces = await queryRunner.query(
      `SELECT * FROM workspace_users_user`,
    );

    const values = workspaces.map((item) => [item.workspaceId, item.userId]);
    console.log('values', values);
    if (values.length) {
      await queryRunner.query(
        `INSERT INTO project_users_user (projectUuid, userId) VALUES ?`,
        [values],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`project_users_user\` DROP FOREIGN KEY \`FK_f8300efd87679e1e21532be9808\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_users_user\` DROP FOREIGN KEY \`FK_6a2f9d94e82e85ba623237023bd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_test_history\` CHANGE \`general\` \`general\` json NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f8300efd87679e1e21532be980\` ON \`project_users_user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_6a2f9d94e82e85ba623237023b\` ON \`project_users_user\``,
    );
    await queryRunner.query(`DROP TABLE \`project_users_user\``);
  }
}

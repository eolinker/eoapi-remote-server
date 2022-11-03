import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1911667456332263 implements MigrationInterface {
    name = 'updateTable1911667456332263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mock\` ADD \`apiDataUuid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`mock\` ADD CONSTRAINT \`FK_369b5e31d6e3ac04039542b92e5\` FOREIGN KEY (\`apiDataUuid\`) REFERENCES \`api_data\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mock\` DROP FOREIGN KEY \`FK_369b5e31d6e3ac04039542b92e5\``);
        await queryRunner.query(`ALTER TABLE \`mock\` DROP COLUMN \`apiDataUuid\``);
    }

}

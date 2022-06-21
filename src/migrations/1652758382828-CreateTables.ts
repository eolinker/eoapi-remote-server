import { ApiDataColumn } from 'src/entities/apiData.entity';
import { APITestHistoryColumn } from 'src/entities/apiTestHistory.entity';
import { MockColumn } from 'src/entities/mock.entity';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTables1652758382828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'project',
        columns: [
          {
            name: 'uuid',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: 'increment primary key',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            comment: '项目名称',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
            comment: '项目描述',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            onUpdate: 'current_timestamp',
            default: 'current_timestamp',
          },
        ],
        indices: [
          {
            name: 'IDX_NAME',
            columnNames: ['name'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'environment',
        columns: [
          {
            name: 'uuid',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: 'increment primary key',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            comment: 'env name',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
            comment: 'env description',
          },
          {
            name: 'projectID',
            type: 'int',
            default: 0,
            comment: 'project primary key',
          },
          {
            name: 'hostUri',
            type: 'varchar',
            length: '255',
            comment: 'prefix url',
          },
          {
            name: 'parameters',
            type: 'json',
            isNullable: true,
            comment: 'env variables',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            onUpdate: 'current_timestamp',
            default: 'current_timestamp',
          },
        ],
        indices: [
          {
            name: 'IDX_PROJECT_ID',
            columnNames: ['projectID'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'api_group',
        columns: [
          {
            name: 'uuid',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: 'increment primary key',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            comment: '分组名称',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
            comment: '分组描述',
          },
          {
            name: 'projectID',
            type: 'int',
            default: 0,
            comment: 'project primary key',
          },
          {
            name: 'parentID',
            type: 'int',
            default: 0,
            comment: '上层分组',
          },
          {
            name: 'weight',
            type: 'int',
            default: 0,
            comment: '排序号',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            onUpdate: 'current_timestamp',
            default: 'current_timestamp',
          },
        ],
        indices: [
          {
            name: 'IDX_PROJECT_ID_PARENT_ID',
            columnNames: ['projectID', 'parentID'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'api_data',
        columns: ApiDataColumn,
        indices: [
          {
            name: 'IDX_GROUP_ID_PROJECT_ID',
            columnNames: ['groupID', 'projectID'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'api_test_history',
        columns: APITestHistoryColumn,
        indices: [
          {
            name: 'IDX_API_DATA_ID_PROJECT_ID',
            columnNames: ['apiDataID', 'projectID'],
          },
        ],
      }),
      true,
    );
    await queryRunner.createTable(
      new Table({
        name: 'mock',
        columns: MockColumn,
        indices: [
          {
            name: 'IDX_API_DATA_ID_PROJECT_ID',
            columnNames: ['apiDataID', 'projectID'],
          },
        ],
      }),
      true,
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('apiTestHistory');
    await queryRunner.dropTable('mock');
    await queryRunner.dropTable('apiData');
    await queryRunner.dropTable('apiGroup');
    await queryRunner.dropTable('environment');
    await queryRunner.dropTable('project');

  }
}

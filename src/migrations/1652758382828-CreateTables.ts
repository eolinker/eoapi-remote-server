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
            comment: '自增主键ID',
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
            comment: '自增主键ID',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            comment: '环境名称',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
            comment: '环境描述',
          },
          {
            name: 'projectID',
            type: 'int',
            default: 0,
            comment: '项目主键',
          },
          {
            name: 'hostUri',
            type: 'varchar',
            length: '255',
            comment: '前置url',
          },
          {
            name: 'parameters',
            type: 'json',
            isNullable: true,
            comment: '环境变量',
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
            comment: '自增主键ID',
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
            comment: '项目主键',
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
        columns: [
          {
            name: 'uuid',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: '自增主键ID',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            comment: 'API名称',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
            comment: 'API描述',
          },
          {
            name: 'projectID',
            type: 'int',
            default: 0,
            comment: '项目主键',
          },
          {
            name: 'groupID',
            type: 'int',
            default: 0,
            comment: '分组ID',
          },
          {
            name: 'uri',
            type: 'varchar',
            comment: '请求地址',
          },
          {
            name: 'protocol',
            type: 'varchar',
            length: '20',
            comment: 'API协议',
          },
          {
            name: 'method',
            type: 'varchar',
            length: '20',
            comment: '请求方法',
          },
          {
            name: 'requestBodyType',
            type: 'varchar',
            length: '20',
            comment: '请求的参数类型',
          },
          {
            name: 'requestHeaders',
            type: 'json',
            isNullable: true,
            comment: '请求头数据',
          },
          {
            name: 'requestBodyJsonType',
            type: 'varchar',
            length: '20',
            comment: '请求的json参数根类型',
          },
          {
            name: 'requestBody',
            type: 'json',
            isNullable: true,
            comment: '请求参数(多层结构)',
          },
          {
            name: 'queryParams',
            type: 'json',
            isNullable: true,
            comment: 'get请求参数',
          },
          {
            name: 'restParams',
            type: 'json',
            isNullable: true,
            comment: 'rest请求参数',
          },
          {
            name: 'responseHeaders',
            type: 'json',
            isNullable: true,
            comment: '返回头数据',
          },
          {
            name: 'responseBody',
            type: 'json',
            isNullable: true,
            comment: '返回参数(多层结构)',
          },
          {
            name: 'responseBodyType',
            type: 'varchar',
            length: '20',
            comment: '返回的参数类型',
          },
          {
            name: 'responseBodyJsonType',
            type: 'varchar',
            length: '20',
            comment: '返回参数json根类型',
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
        columns: [
          {
            name: 'uuid',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: '自增主键ID',
          },
          {
            name: 'projectID',
            type: 'int',
            default: 0,
            comment: '项目主键',
          },
          {
            name: 'apiDataID',
            type: 'int',
            default: 0,
            comment: 'Api数据ID',
          },
          {
            name: 'general',
            type: 'json',
            isNullable: true,
            comment: 'General indicators',
          },
          {
            name: 'request',
            type: 'json',
            isNullable: true,
            comment: 'HTTP Request',
          },
          {
            name: 'response',
            type: 'json',
            isNullable: true,
            comment: 'HTTP response',
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
    await queryRunner.dropTable('apiData');
    await queryRunner.dropTable('apiGroup');
    await queryRunner.dropTable('environment');
    await queryRunner.dropTable('project');
  }
}

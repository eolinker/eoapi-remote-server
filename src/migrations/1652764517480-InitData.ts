import { MigrationInterface, QueryRunner } from 'typeorm';
import { sampleApiData } from '../modules/workspace/apiData/samples/sample.api.data';

export class InitData1652764517480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO project (uuid, name) VALUES (?, ?)`, [
      1,
      '默认项目',
    ]);

    await queryRunner.query(
      `INSERT INTO api_group (uuid, name, projectID) VALUES (?, ?, ?)`,
      [1, '默认组', 1],
    );

    const apiData = [];
    sampleApiData.forEach((item) => {
      apiData.push([
        item.uuid,
        item.uniqueID,
        item.name,
        item.projectID,
        item.groupID,
        item.uri,
        item.protocol,
        item.method,
        item.requestBodyType,
        item.requestBodyJsonType,
        JSON.stringify(item.requestBody),
        JSON.stringify(item.requestHeaders),
        JSON.stringify(item.queryParams),
        JSON.stringify(item.restParams),
        JSON.stringify(item.responseHeaders),
        item.responseBodyType,
        item.responseBodyJsonType,
        JSON.stringify(item.responseBody),
      ]);
    });
    await queryRunner.query(
      `INSERT INTO api_data (uuid, uniqueID,name, projectID, groupID, uri, protocol, method, requestBodyType, requestBodyJsonType,requestBody,requestHeaders, queryParams, restParams, responseHeaders, responseBodyType, responseBodyJsonType, responseBody) VALUES ?`,
      [apiData],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE api_data`);
    await queryRunner.query(`TRUNCATE api_group`);
    await queryRunner.query(`TRUNCATE project`);
  }
}

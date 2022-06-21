import { MigrationInterface, QueryRunner } from 'typeorm';

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

    const items = [
      {
        uuid: 1,
        uniqueID:'f2c2a5c2-a41a-428c-88ac-62f7a563d572',
        name: '获取城市今日天气',
        projectID: 1,
        uri: 'http://www.weather.com.cn/data/cityinfo/{cityCode}.html',
        groupID: 0,
        protocol: 'http',
        method: 'GET',
        requestBodyType: 'raw',
        requestBodyJsonType: 'object',
        requestBody: '',
        queryParams: [],
        restParams: [
          {
            name: 'cityCode',
            required: true,
            example: '101010100',
            description:
              '城市代码 : http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html',
            enum: [
              { default: true, value: '110000', description: 'Beijing' },
              { default: false, value: '440000', description: 'Guangdong' },
              { default: false, value: '', description: '' },
            ],
          },
        ],
        requestHeaders: [],
        responseHeaders: [],
        responseBodyType: 'json',
        responseBodyJsonType: 'object',
        responseBody: [
          {
            name: 'weatherinfo',
            required: true,
            example: '',
            type: 'object',
            description: '',
            children: [
              {
                name: 'city',
                description: '',
                type: 'string',
                required: true,
                example: '北京',
              },
              {
                name: 'cityid',
                description: '',
                type: 'string',
                required: true,
                example: '101010100',
              },
              {
                name: 'temp1',
                description: '最低温度',
                type: 'string',
                required: true,
                example: '18℃',
              },
              {
                name: 'temp2',
                description: '当日最高温度',
                type: 'string',
                required: true,
                example: '31℃',
              },
              {
                name: 'weather',
                description: '',
                type: 'string',
                required: true,
                example: '多云转阴',
              },
              {
                name: 'img1',
                description: '',
                type: 'string',
                required: true,
                example: 'n1.gif',
              },
              {
                name: 'img2',
                description: '',
                type: 'string',
                required: true,
                example: 'd2.gif',
              },
              {
                name: 'ptime',
                description: '',
                type: 'string',
                required: true,
                example: '18:00',
              },
            ],
          },
        ],
        weight: 0,
      },
      {
        uuid: 2,
        uniqueID:'9ed1190a-d057-4127-94ca-0f99a8890e72',
        name: '新冠全国疫情',
        projectID: 1,
        uri: 'https://view.inews.qq.com/g2/getOnsInfo',
        groupID: 0,
        protocol: 'http',
        method: 'GET',
        requestBodyType: 'raw',
        requestBodyJsonType: 'object',
        requestBody: '',
        queryParams: [{ name: 'name', required: true, example: 'disease_h5' }],
        restParams: [],
        requestHeaders: [],
        responseHeaders: [
          {
            name: 'date',
            required: true,
            description: '',
            example: 'Sat, 05 Feb 2022 04:30:44 GMT',
          },
          {
            name: 'content-type',
            required: true,
            description: '',
            example: 'application/json',
          },
          {
            name: 'transfer-encoding',
            required: true,
            description: '',
            example: 'chunked',
          },
          {
            name: 'connection',
            required: true,
            description: '',
            example: 'close',
          },
          {
            name: 'server',
            required: true,
            description: '',
            example: 'openresty',
          },
          {
            name: 'tracecode',
            required: true,
            description: '',
            example: '8QMewH9c6JodvyHb5wE=',
          },
          {
            name: 'x-client-ip',
            required: true,
            description: '',
            example: '120.26.198.150',
          },
          {
            name: 'x-server-ip',
            required: true,
            description: '',
            example: '58.250.137.40',
          },
        ],
        responseBodyType: 'json',
        responseBodyJsonType: 'object',
        responseBody: [
          {
            name: 'ret',
            description: '',
            type: 'number',
            required: true,
            example: '',
          },
          {
            name: 'data',
            description: '实际参数是 string，为了展示文档展开显示',
            type: 'object',
            required: true,
            example:
              '{"lastUpdateTime":"2022-02-05 11:52:51","chinaTotal":{"confirm":139641,"heal":126827,"dead":5700,"nowConfirm":7114,"suspect":2,"nowSevere":6,"importedCase":12684,"noInfect":887,"showLocalConfirm":1,"showlocalinfeciton":1,"localConfirm":851,"noInfectH5":109,"localConfirmH5":850,"local_acc_confirm":106297},"chinaAdd":{"confirm":321,"heal":165,"dead":0,"nowConfirm":156,"suspect":-2,"nowSevere":0,"importedCase":18,"noInfect":60,"localConfirm":-67,"noInfectH5":0,"localConfirmH5":9},"isShowAdd":true,"showAddSwitch":{"all":true,"confirm":true,"suspect":true,"dead":true,"heal":true,"nowConfirm":true,"nowSevere":true,"importedCase":true,"noInfect":true,"localConfirm":true,"localinfeciton":true},"areaTree":[{"name":"中国","today":{"confirm":321,"isUpdated":true},"total":{"nowConfirm":7114,"confirm":139641,"dead":5700,"showRate":false,"heal":126827,"showHeal":true,"wzz":0,"provinceLocalConfirm":0}}]}',
            enum: [{ default: false, value: '', description: '' }],
            children: [
              {
                name: 'areaTree',
                required: true,
                example: '',
                type: 'array',
                description: '',
                children: [
                  {
                    name: 'name',
                    description: '',
                    type: 'string',
                    required: true,
                    example: '中国',
                  },
                  {
                    name: 'today',
                    required: true,
                    example: '',
                    type: 'object',
                    description: '',
                    children: [
                      {
                        name: 'confirm',
                        description: '',
                        type: 'number',
                        required: true,
                        example: '321',
                      },
                      {
                        name: 'isUpdated',
                        description: '',
                        type: 'boolean',
                        required: true,
                        example: 'true',
                      },
                    ],
                  },
                  {
                    name: 'total',
                    required: true,
                    example: '',
                    type: 'object',
                    description: '',
                    children: [
                      {
                        name: 'nowConfirm',
                        description: '',
                        type: 'number',
                        required: true,
                        example: '7114',
                      },
                      {
                        name: 'confirm',
                        description: '',
                        type: 'number',
                        required: true,
                        example: '139641',
                      },
                      {
                        name: 'dead',
                        description: '',
                        type: 'number',
                        required: true,
                        example: '5700',
                      },
                      {
                        name: 'showRate',
                        description: '',
                        type: 'boolean',
                        required: true,
                        example: '',
                      },
                      {
                        name: 'heal',
                        description: '',
                        type: 'number',
                        required: true,
                        example: '126827',
                      },
                      {
                        name: 'showHeal',
                        description: '',
                        type: 'boolean',
                        required: true,
                        example: 'true',
                      },
                      {
                        name: 'wzz',
                        description: '',
                        type: 'number',
                        required: true,
                        example: '',
                      },
                      {
                        name: 'provinceLocalConfirm',
                        description: '',
                        type: 'number',
                        required: true,
                        example: '',
                      },
                    ],
                  },
                  {
                    name: 'children',
                    type: 'array',
                    required: true,
                    example: '',
                    enum: [],
                    description: '',
                  },
                ],
              },
              {
                name: 'chinaTotal',
                required: true,
                example: '',
                type: 'object',
                description: '',
              },
              {
                name: 'chinaAdd',
                required: true,
                example: '',
                type: 'object',
                description: '',
              },
              {
                name: 'showAddSwitch',
                required: true,
                example: '',
                type: 'object',
                description: '',
              },
              {
                name: 'lastUpdateTime',
                description: '',
                type: 'object',
                required: true,
                example: '2022-02-05 11:52:51',
              },
            ],
          },
        ],
        weight: 0,
      },
    ];

    const apiData = [];
    items.forEach((item) => {
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

import { Injectable } from '@nestjs/common';
import { MockMatchDto } from '@/app.dto';
import { ApiData } from '@/entities/apiData.entity';
import { ApiDataService } from '@/modules/workspace/apiData/apiData.service';
import { MockService } from '@/modules/workspace/mock/mock.service';
import { tree2obj } from '@/utils';

@Injectable()
export class AppService {
  constructor(
    private apiDataService: ApiDataService,
    private mockService: MockService,
  ) {}

  getHello(): string {
    return 'Eoapi,Hello World!';
  }

  async mockMatch(body: MockMatchDto) {
    const { projectID, mockID, req } = body;
    if (!Number.isNaN(Number(mockID))) {
      try {
        const mock = await this.mockService.findOne({
          where: { uuid: Number(mockID) },
        });
        const apiData = await this.apiDataService.findOne({
          where: { uuid: Number(mock.apiDataID) },
        });
        if (mock?.createWay === 'system') {
          console.log('apiData.responseBody', apiData.responseBody);
          return this.matchApiData(apiData, req);
        } else {
          const result = await this.matchApiData(apiData, req);
          mock.response =
            result.statusCode === 404
              ? result
              : mock?.response ?? this.generateResponse(apiData.responseBody);
        }
        return mock;
      } catch (error) {
        return {
          response: {
            message: error,
          },
        };
      }
      // Whether the matching request mode is enabled
    } else {
      const response = await this.batchMatchApiData(projectID, req);
      return response;
    }
  }

  /**
   * generate response data
   *
   * @returns
   */
  generateResponse(responseBody: ApiData['responseBody']) {
    return tree2obj([].concat(responseBody), {
      key: 'name',
      valueKey: 'description',
    });
  }
  /**
   * match apiData by method and url
   *
   * @param projectID
   * @param req
   * @returns
   */
  async matchApiData(apiData: ApiData, req?) {
    const { restParams, queryParams, method } = apiData;
    const { pathname } = new URL(req.url, 'http://localhost:3040');
    let uri = apiData.uri.trim();
    let isQueryMatch = true;
    if (Array.isArray(restParams) && restParams.length > 0) {
      const restMap = restParams.reduce(
        (p, c) => ((p[c.name] = c.example), p),
        {},
      );
      uri = uri.replace(/\{(.+?)\}/g, (match, p) => restMap[p] ?? match);
    }
    if (Array.isArray(queryParams) && queryParams.length > 0) {
      const query = req.query;
      isQueryMatch = queryParams.every((n) => n.example === query[n.name]);
    }
    const uriReg = new RegExp(`^/?${uri}/?$`);
    const isMatch =
      method === req.method && uriReg.test(pathname) && isQueryMatch;
    return isMatch
      ? { response: this.generateResponse(apiData.responseBody) }
      : { statusCode: 404 };
  }

  async batchMatchApiData(projectID = 1, req) {
    const apiDatas = await this.apiDataService.findAll({ projectID });
    let result;
    for (const api of apiDatas) {
      result = await this.matchApiData(api, req);
      if (result?.statusCode !== 404) {
        return result;
      }
    }
    return result;
  }
}

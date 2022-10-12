export class CreateDto {
  name: string;
  description?: string;
  projectID: number;
  groupID: number;
  uri: string;
  protocol: string;
  method: string;
  requestBodyType: string;
  requestHeaders: any;
  requestBodyJsonType: string;
  requestBody: any;
  queryParams: any;
  restParams: any;
  responseHeaders: any;
  responseBody: any;
  responseBodyType: string;
  responseBodyJsonType: string;
  weight: number;
}

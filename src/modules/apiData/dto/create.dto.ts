export class CreateDto {
  uuid: number;
  name: string;
  description: string;
  projectID: number;
  groupID: number;
  uri: string;
  protocol: string;
  method: string;
  requestBodyType: string;
  requestHeaders: string;
  requestBodyJsonType: string;
  requestBody: string;
  queryParams: string;
  restParams: string;
  responseHeaders: string;
  responseBody: string;
  responseBodyType: string;
  responseBodyJsonType: string;
  weight: number;
}

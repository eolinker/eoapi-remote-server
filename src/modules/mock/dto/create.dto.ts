export type CreateWay = 'system' | 'custom';
export class CreateDto {
  name: string;
  description: string;
  apiDataID: number;
  projectID: number;
  response: string;
  createWay: string;
}

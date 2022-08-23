export class CreateDto {
  name: string;
  description?: string;
  projectID: number;
  hostUri: string;
  parameters?: string;
}

import { Child, Environment } from './import.dto';

export class ExportProjectResultDto {
  collections: Child[];
  environments: Environment[];
}

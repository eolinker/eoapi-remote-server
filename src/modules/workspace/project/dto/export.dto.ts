import { Child, Environment as EnvironmentType } from './import.dto';
import { ApiData } from '@/entities/apiData.entity';
import { ApiGroup } from '@/entities/apiGroup.entity';
import { Environment } from '@/entities/environment.entity';
import { Project } from '@/entities/project.entity';

export class ExportCollectionsResultDto {
  collections: Child;
  enviroments: EnvironmentType;
}

export class ExportProjectResultDto {
  environment: Environment[];
  group: ApiGroup[];
  project: Project;
  apiData: ApiData[];
}

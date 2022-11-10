import { ApiData } from '@/entities/apiData.entity';
import { ApiGroup } from '@/entities/apiGroup.entity';

export class QueryDto {
  name: string;
}

export class CollectionsDto {
  groups: ApiGroup[];
  apis: ApiData[];
}

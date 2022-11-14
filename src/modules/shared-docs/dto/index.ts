import { ApiProperty } from '@nestjs/swagger';
import { ApiData } from '@/entities/apiData.entity';
import { ApiGroup } from '@/entities/apiGroup.entity';

export class CollectionsDto {
  @ApiProperty({ type: [ApiGroup] })
  groups: ApiGroup[];

  @ApiProperty({ type: [ApiData] })
  apis: ApiData[];
}

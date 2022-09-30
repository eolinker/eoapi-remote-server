import { ApiParam, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({ description: 'api名称' })
  @IsOptional()
  name: string;

  projectID: number;

  @ApiPropertyOptional({ description: '分组ID' })
  @IsOptional()
  groupID: number;
}

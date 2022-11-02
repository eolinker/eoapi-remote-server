import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtLogoutDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

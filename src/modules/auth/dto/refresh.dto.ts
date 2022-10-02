import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtRefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

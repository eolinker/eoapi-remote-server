import { ApiProperty } from '@nestjs/swagger';

export class LoginToken {
  @ApiProperty({ description: 'JWT身份Token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token' })
  refreshToken: string;

  @ApiProperty()
  accessTokenExpiresAt: number;

  @ApiProperty()
  refreshTokenExpiresAt: number;
}

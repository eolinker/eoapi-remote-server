import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginInfoDto {
  @ApiProperty({ description: '管理员用户名' })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ description: '管理员密码' })
  @IsString()
  @MinLength(4)
  password: string;
}

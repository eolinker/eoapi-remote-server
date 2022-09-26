import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ description: '用户名' })
  @MinLength(1)
  @IsString()
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @MinLength(1)
  @IsString()
  readonly password: string;
}
export class CreateUserDto extends UserLoginDto {}

export class UserLoginToken {
  @ApiProperty({ description: 'JWT身份Token' })
  token: string;
}

export class UpdateUserInfoDto {
  @ApiProperty({ description: '用户名', required: false })
  @MinLength(1)
  @IsString()
  readonly username: string;

  @ApiProperty({ description: '头像', required: false })
  @MinLength(1)
  @IsString()
  readonly avatar: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty({ description: '密码', required: false })
  @MinLength(1)
  @IsString()
  readonly password: string;
}

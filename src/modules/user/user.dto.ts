import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { UserEntity } from '@/entities/user.entity';

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

export class UpdateUserInfoDto extends PartialType(
  OmitType(UserEntity, ['password', 'passwordVersion']),
) {}

export class UpdateUserPasswordDto {
  @ApiProperty({ description: '新密码', required: false })
  @MinLength(6)
  @IsString()
  readonly newPassword: string;
}

export class UserInfoValidator {
  @ApiProperty({ description: '新密码', required: false })
  @MinLength(6)
  @IsString()
  readonly newPassword: string;
}

export class UserLoginResultDto extends UserEntity {
  isFirstLogin: boolean;
}

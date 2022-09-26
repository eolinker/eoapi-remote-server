import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString, MinLength } from 'class-validator';
import { UserEntity } from '@/entities/user.entity';

export class CreateWorkspaceDto {
  @ApiProperty({ description: '空间名称' })
  @MinLength(1)
  @IsString()
  readonly name: string;
}
export class UpdateWorkspaceDto extends CreateWorkspaceDto {}

export class WorkspaceListDto {
  @ApiProperty({ description: '空间名称' })
  @MinLength(1)
  @IsString()
  readonly name: string;
}

export class WorkspaceMemberAddDto {
  @ApiProperty({ description: '用户id数组', type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  readonly userIDs: number[];
}

export class WorkspaceMemberRemoveDto extends WorkspaceMemberAddDto {}

export class WorkspaceUser extends UserEntity {
  @ApiProperty({ description: '成员身份' })
  @MinLength(1)
  @IsString()
  readonly roleName: string = 'member';
}

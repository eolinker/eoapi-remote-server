import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '@/enums/role.enum';
import { UserEntity } from '@/entities/user.entity';
import { RoleEntity } from '@/entities/role.entity';

export class CreateWorkspaceDto {
  @ApiProperty({ description: '空间名称' })
  @MinLength(1)
  @IsString()
  readonly title: string;
}
export class UpdateWorkspaceDto extends CreateWorkspaceDto {}

export class WorkspaceListDto {
  @ApiProperty({ description: '空间名称' })
  @MinLength(1)
  @IsString()
  readonly title: string;
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
export class SetRoleDto {
  @IsInt()
  @Min(RoleEnum.WorkspaceOwnerRoleID)
  @Max(RoleEnum.WorkspaceEditorRoleID)
  roleID: number;

  memberID: number;
}

export class RolePermissionDto {
  permissions: string[];
  role: RoleEntity;
}

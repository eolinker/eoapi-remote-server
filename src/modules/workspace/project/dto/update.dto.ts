import { PartialType } from '@nestjs/mapped-types';
import { IsInt, Max, Min } from 'class-validator';
import { CreateDto } from './create.dto';
import { RoleEnum } from '@/enums/role.enum';

export class UpdateDto extends PartialType(CreateDto) {}

export class SetRoleDto {
  @IsInt()
  @Min(RoleEnum.ProjectOwnerRoleID)
  @Max(RoleEnum.ProjectEditorRoleID)
  roleID: number;

  memberID: number;
}

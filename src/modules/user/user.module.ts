import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '@/entities/user.entity';
import { WorkspaceUserRoleEntity } from '@/entities/workspace-user-role.entity';
import { ProjectUserRoleEntity } from '@/entities/project-user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      WorkspaceUserRoleEntity,
      ProjectUserRoleEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceEntity } from '@/entities/workspace.entity';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity]), UserModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}

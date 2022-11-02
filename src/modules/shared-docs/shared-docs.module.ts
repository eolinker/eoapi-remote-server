import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedDocsController } from './shared-docs.controller';
import { SharedDocsService } from './shared-docs.service';
import { WorkspaceModule } from '@/modules/workspace/workspace.module';
import { SharedEntity } from '@/entities/shared.entity';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SharedEntity]),
    WorkspaceModule,
    UserModule,
  ],
  controllers: [SharedDocsController],
  providers: [SharedDocsService],
  exports: [SharedDocsService],
})
export class ShareDocsModule {}

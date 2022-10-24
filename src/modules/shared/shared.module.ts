import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SharedController } from './shared.controller';
import { SharedService } from './shared.service';
import { WorkspaceModule } from '@/modules/workspace/workspace.module';
import { SharedEntity } from '@/entities/shared.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SharedEntity]),
    WorkspaceModule,
    UserModule,
  ],
  controllers: [SharedController],
  providers: [SharedService],
  exports: [SharedService],
})
export class ShareModule {}

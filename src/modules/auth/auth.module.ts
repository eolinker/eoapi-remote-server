import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserModule } from '@/modules/user/user.module';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthEntity } from '@/entities/auth.entity';
import { WorkspaceModule } from '@/modules/workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    PassportModule,
    ConfigModule,
    UserModule,
    WorkspaceModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

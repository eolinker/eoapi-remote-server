import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy';
import { UserModule } from '@/modules/user/user.module';
import { AuthService } from '@/modules/auth/auth.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AuthEntity } from '@/entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    PassportModule,
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    HeaderApiKeyStrategy,
    AuthService,
    // JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}

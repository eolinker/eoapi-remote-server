import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 引入数据库的及配置文件
import { AuthModule } from './modules/auth/auth.module';
import { ShareDocsModule } from './modules/shared-docs/shared-docs.module';
import { getConfiguration } from './config/configuration';
import { UserModule } from '@/modules/user/user.module';
import { WorkspaceModule } from '@/modules/workspace/workspace.module';
import { SharedModule } from '@/shared/shared.module';

console.log('process.env.NODE_ENV', `.env.${process.env.NODE_ENV}`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [getConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoLoadEntities: true,
        type: configService.get<any>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get('database.logging'),
        timezone: configService.get('database.timezone'), // 时区
      }),
    }), // 数据库
    WorkspaceModule,
    SharedModule,
    AuthModule, // 认证
    UserModule,
    ShareDocsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

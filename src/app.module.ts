import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 引入数据库的及配置文件
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { ApiGroupModule } from './modules/apiGroup/apiGroup.module';
import { EnvironmentModule } from './modules/environment/environment.module';
import { ApiDataModule } from './modules/apiData/apiData.module';
import { ApiTestHistoryModule } from './modules/apiTestHistory/apiTestHistory.module';
import { MockModule } from './modules/mock/mock.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(), // 数据库
    AuthModule, // 认证
    ProjectModule,
    ApiGroupModule,
    EnvironmentModule,
    ApiDataModule,
    ApiTestHistoryModule,
    MockModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

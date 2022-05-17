import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 引入数据库的及配置文件
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './modules/project/project.module';
import { ApiGroupModule } from './modules/apiGroup/apiGroup.module';
import { EnvironmentModule } from './modules/environment/environment.module';
import { ApiDataModule } from './modules/apiData/apiData.module';
import { ApiTestHistoryModule } from './modules/apiTestHistory/apiTestHistory.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(), // 数据库
    ProjectModule,
    ApiGroupModule,
    EnvironmentModule,
    ApiDataModule,
    ApiTestHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

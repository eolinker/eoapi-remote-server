import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AppDataSource } from './config/data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(3000, '0.0.0.0', () => {
    Logger.log(`api服务已经启动,请访问: http://localhost:3000`);
  });
}

AppDataSource.initialize()
  .then(async () => {
    // run all migrations
    await AppDataSource.runMigrations();

    // and undo migrations two times (because we have two migrations)
    // await AppDataSource.undoLastMigration();
    // await AppDataSource.undoLastMigration();

    // console.log('Done. We run two migrations then reverted them.');
    await bootstrap();
  })
  .catch((error) => console.log(error));

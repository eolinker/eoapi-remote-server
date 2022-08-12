import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { writeFileSync } from 'node:fs';
import { getOrmConfig } from './config/ormconfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.EOAPI_SERVER_PORT, '0.0.0.0');
  Logger.log(`api服务已经启动,请访问: ${await app.getUrl()}`);
}

const generateOrmconfigJson = () => {
  // try {
  //   writeFileSync('./ormconfig.json', JSON.stringify(getOrmConfig(), null, 2));
  //   console.log('ormconfig.json 写入成功');
  // } catch (err) {
  //   console.error(err);
  // }
};

bootstrap().then(generateOrmconfigJson);

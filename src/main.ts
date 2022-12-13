import { NestFactory, Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { setupSwagger } from '@/setup-swagger';
import { ApiExceptionFilter } from '@/common/filters/api-exception.filter';
import { ApiTransformInterceptor } from '@/common/interceptors/api-transform.interceptor';
import { ValidationPipe } from '@/pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.setGlobalPrefix(process.env.EOAPI_API_PREFIX || '/api');

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe());
  // execption
  app.useGlobalFilters(new ApiExceptionFilter());
  // api interceptor
  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));
  // swagger
  setupSwagger(app);
  await app.listen(process.env.EOAPI_SERVER_PORT, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`Remote Server start successfully,please visit: ${serverUrl}`);
  // Logger.log(`API文档已生成,请访问: ${serverUrl}/${process.env.SWAGGER_PATH}/`);
}

bootstrap();

import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { UtilService } from '@/shared/services/util.service';

// common provider list
const providers = [UtilService];

/**
 * 全局共享模块
 */
@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [...providers],
  exports: [HttpModule, ...providers],
})
export class SharedModule {}

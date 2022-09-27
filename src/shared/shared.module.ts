import { HttpModule } from '@nestjs/axios';
import { Global, CacheModule, Module } from '@nestjs/common';

// common provider list

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
  providers: [],
  exports: [HttpModule, CacheModule],
})
export class SharedModule {}

import { Controller, Get } from '@nestjs/common';
import { version } from '../package.json';
import { AppService } from './app.service';
import { Public } from '@/common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('system/status')
  @Public()
  status() {
    return `v${version}`;
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@/decorators/public.decorator';

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
    return 'success';
  }
}

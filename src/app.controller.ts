import { Body, Controller, Get, Post } from '@nestjs/common';
import { version } from '../package.json';
import { AppService } from './app.service';
import { Public } from '@/common/decorators/public.decorator';
import { MockMatchDto } from '@/app.dto';

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
    return version;
  }

  @Post('mock/match')
  @Public()
  mockMatch(@Body() body: MockMatchDto) {
    return this.appService.mockMatch(body);
  }
}

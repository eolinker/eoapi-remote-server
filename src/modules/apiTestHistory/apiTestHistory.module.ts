import { Module } from '@nestjs/common';
import { ApiTestHistoryService } from './apiTestHistory.service';
import { ApiTestHistoryController } from './apiTestHistory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiTestHistory } from '../..//entities/apiTestHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiTestHistory])],
  controllers: [ApiTestHistoryController],
  providers: [ApiTestHistoryService],
})
export class ApiTestHistoryModule {}

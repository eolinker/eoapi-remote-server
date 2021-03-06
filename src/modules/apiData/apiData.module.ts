import { Module } from '@nestjs/common';
import { ApiDataService } from './apiData.service';
import { ApiDataController } from './apiData.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiData } from '../..//entities/apiData.entity';
import { MockModule } from '../mock/mock.module';
import { Mock } from '../../entities/mock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiData, Mock]), MockModule],
  controllers: [ApiDataController],
  providers: [ApiDataService],
  exports: [ApiDataService],
})
export class ApiDataModule {}

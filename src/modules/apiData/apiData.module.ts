import { Module } from '@nestjs/common';
import { ApiDataService } from './apiData.service';
import { ApiDataController } from './apiData.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiData } from '../..//entities/apiData.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiData])],
  controllers: [ApiDataController],
  providers: [ApiDataService],
})
export class ApiDataModule {}

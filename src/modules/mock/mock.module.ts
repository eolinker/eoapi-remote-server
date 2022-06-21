import { Module } from '@nestjs/common';
import { MockService } from './mock.service';
import { MockController } from './mock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mock } from '../../entities/mock.entity';
import { ApiData } from 'src/entities/apiData.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mock, ApiData])],
  controllers: [MockController],
  providers: [MockService],
  exports: [MockService],
})
export class MockModule {}

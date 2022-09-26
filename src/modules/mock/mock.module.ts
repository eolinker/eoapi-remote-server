import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiData } from 'src/entities/apiData.entity';
import { Mock } from '../../entities/mock.entity';
import { MockService } from './mock.service';
import { MockController } from './mock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mock, ApiData])],
  controllers: [MockController],
  providers: [MockService],
  exports: [MockService],
})
export class MockModule {}

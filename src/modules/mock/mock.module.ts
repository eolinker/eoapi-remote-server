
import { Module } from '@nestjs/common';
import { MockService } from './mock.service';
import { MockController } from './mock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mock } from '../../entities/mock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mock])],
  controllers: [MockController],
  providers: [MockService],
})
export class MockModule {}

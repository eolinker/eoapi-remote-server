import { Module } from '@nestjs/common';
import { ApiGroupService } from './apiGroup.service';
import { ApiGroupController } from './apiGroup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiGroup } from '../..//entities/apiGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiGroup])],
  controllers: [ApiGroupController],
  providers: [ApiGroupService],
})
export class ApiGroupModule {}

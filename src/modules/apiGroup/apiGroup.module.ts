import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiGroup } from '../..//entities/apiGroup.entity';
import { ApiGroupService } from './apiGroup.service';
import { ApiGroupController } from './apiGroup.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApiGroup])],
  controllers: [ApiGroupController],
  providers: [ApiGroupService],
  exports: [ApiGroupService],
})
export class ApiGroupModule {}

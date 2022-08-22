import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity';
import { ApiDataModule } from '../apiData/apiData.module';
import { ApiGroupModule } from '../apiGroup/apiGroup.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), ApiDataModule, ApiGroupModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}

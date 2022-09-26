import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceEntity } from '@/entities/workspace.entity';
import { UserEntity } from '@/entities/user.entity';
import { Project } from '@/entities/project.entity';
import { ApiData } from '@/entities/apiData.entity';
import { Mock } from '@/entities/mock.entity';
import { ApiTestHistory } from '@/entities/apiTestHistory.entity';
import { ApiGroup } from '@/entities/apiGroup.entity';
import { Environment } from '@/entities/environment.entity';
import { ApiDataController } from '@/modules/workspace/apiData/apiData.controller';
import { EnvironmentController } from '@/modules/workspace/environment/environment.controller';
import { ApiTestHistoryController } from '@/modules/workspace/apiTestHistory/apiTestHistory.controller';
import { MockController } from '@/modules/workspace/mock/mock.controller';
import { ProjectController } from '@/modules/workspace/project/project.controller';
import { UserService } from '@/modules/user/user.service';
import { ApiDataService } from '@/modules/workspace/apiData/apiData.service';
import { ApiTestHistoryService } from '@/modules/workspace/apiTestHistory/apiTestHistory.service';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { MockService } from '@/modules/workspace/mock/mock.service';
import { EnvironmentService } from '@/modules/workspace/environment/environment.service';
import { ApiGroupService } from '@/modules/workspace/apiGroup/apiGroup.service';
import { ApiGroupController } from '@/modules/workspace/apiGroup/apiGroup.controller';

const commonProviders = [
  WorkspaceService,
  UserService,
  ApiDataService,
  ApiGroupService,
  ApiTestHistoryService,
  ProjectService,
  MockService,
  EnvironmentService,
];
@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceEntity,
      UserEntity,
      Project,
      ApiData,
      Mock,
      ApiTestHistory,
      ApiGroup,
      Environment,
    ]),
  ],
  controllers: [
    WorkspaceController,
    ApiDataController,
    ApiGroupController,
    EnvironmentController,
    ApiTestHistoryController,
    MockController,
    ProjectController,
  ],
  providers: [...commonProviders],
  exports: [...commonProviders],
})
export class WorkspaceModule {}

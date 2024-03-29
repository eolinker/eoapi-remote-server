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
import { ApiDataService } from '@/modules/workspace/apiData/apiData.service';
import { ApiTestHistoryService } from '@/modules/workspace/apiTestHistory/apiTestHistory.service';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { MockService } from '@/modules/workspace/mock/mock.service';
import { EnvironmentService } from '@/modules/workspace/environment/environment.service';
import { ApiGroupService } from '@/modules/workspace/apiGroup/apiGroup.service';
import { ApiGroupController } from '@/modules/workspace/apiGroup/apiGroup.controller';
import { UserModule } from '@/modules/user/user.module';
import { SharedController } from '@/modules/workspace/shared/shared.controller';
import { SharedService } from '@/modules/workspace/shared/shared.service';
import { SharedEntity } from '@/entities/shared.entity';

const commonProviders = [
  WorkspaceService,
  ApiDataService,
  ApiGroupService,
  ApiTestHistoryService,
  ProjectService,
  MockService,
  EnvironmentService,
  SharedService,
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
      SharedEntity,
    ]),
    UserModule,
  ],
  controllers: [
    WorkspaceController,
    ApiDataController,
    ApiGroupController,
    EnvironmentController,
    ApiTestHistoryController,
    MockController,
    ProjectController,
    SharedController,
  ],
  providers: [...commonProviders],
  exports: [...commonProviders],
})
export class WorkspaceModule {}

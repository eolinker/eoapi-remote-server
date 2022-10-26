import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { SharedDocsService } from '@/modules/shared-docs/shared-docs.service';

/**
 * admin perm check guard
 */
@Injectable()
export class SharedAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sharedService: SharedDocsService,
    private projectService: ProjectService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const projectID = request.headers['x-project-id'];

    if (projectID) {
      const projectIsExist = await this.projectService.findOneBy(projectID);

      if (!projectIsExist) {
        throw new NotFoundException('操作失败！项目不存在');
      }
    }

    // 分享的uuid
    const uniqueID = request?.params?.uniqueID;
    console.log('uniqueID', uniqueID);
    if (uniqueID) {
      const shared = await this.sharedService.findOneBy({
        uniqueID: uniqueID,
      });

      if (!shared) {
        throw new NotFoundException('该分享不存在或已被取消分享');
      }
      request.headers['x-project-id'] = shared.projectID;
    }

    // pass
    return true;
  }
}

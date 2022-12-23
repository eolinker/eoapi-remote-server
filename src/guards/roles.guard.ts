import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@/common/decorators/permission.decorator';
import { PermissionEnum } from '@/enums/permission.enum';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { WorkspaceService } from '@/modules/workspace/workspace.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private projectService: ProjectService,
    private workspaceService: WorkspaceService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 当前请求所需权限
    const currentPerm = this.reflector.getAllAndOverride<PermissionEnum>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    // 当前用户
    const { currentUser, params } = context.switchToHttp().getRequest();
    console.log('currentPerm', currentPerm, currentUser, params);

    if (!currentPerm) {
      return true;
    }

    // const rolePermission = this.workspaceService.getRolePermission(currentUser);

    return true;
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

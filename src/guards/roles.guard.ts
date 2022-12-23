import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@/common/decorators/permission.decorator';
import { PermissionEnum } from '@/enums/permission.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 当前请求所需权限
    const currentPerm = this.reflector.getAllAndOverride<PermissionEnum>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log('currentPerm', currentPerm);
    if (!currentPerm) {
      return true;
    }
    return true;
    // const { user } = context.switchToHttp().getRequest();
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

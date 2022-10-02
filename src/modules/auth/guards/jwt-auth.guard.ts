import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { AuthService } from '@/modules/auth/auth.service';
import { IUser } from '@/common/decorators/user.decorator';
import { UserService } from '@/modules/user/user.service';

/**
 * admin perm check guard
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Public可自动放过
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'] as string;
    if (isEmpty(token)) {
      throw new UnauthorizedException();
    }
    try {
      // 挂载对象到当前请求上
      request.currentUser = this.jwtService.verify<IUser>(token);
      const isExit = await this.authService.findOne({ accessToken: token });
      const { passwordVersion } = await this.userService.findOne({
        where: { id: request.currentUser.userId },
        select: ['passwordVersion'],
      });
      if (!isExit || passwordVersion !== request.currentUser.pv) {
        throw new UnauthorizedException();
      }
    } catch (e) {
      // 无法通过token校验
      throw new UnauthorizedException();
    }
    if (isEmpty(request.currentUser)) {
      throw new UnauthorizedException();
    }

    const workspaceID = Number(request?.params?.workspaceID);
    if (!Number.isNaN(workspaceID)) {
      const hasWorkspaceAuth = await this.userService.findOneBy({
        id: request.currentUser.userId,
        workspaces: {
          id: workspaceID,
        },
      });
      if (!hasWorkspaceAuth) {
        throw new ForbiddenException();
      }
    }

    // pass
    return true;
  }
}

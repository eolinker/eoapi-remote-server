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
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';
import { AuthService } from '@/modules/auth/auth.service';
import { IUser } from '@/decorators/user.decorator';
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
      request.user = this.jwtService.verify<IUser>(token);
      const isExit = await this.authService.findOne({ accessToken: token });
      if (!isExit) {
        throw new UnauthorizedException();
      }
    } catch (e) {
      // 无法通过token校验
      throw new UnauthorizedException();
    }
    if (isEmpty(request.user)) {
      throw new UnauthorizedException();
    }

    const workspaceID = request?.params?.workspaceID;

    if (workspaceID) {
      const hasWorkspaceAuth = await this.userService.findOne({
        id: request.user.userId,
        workspaces: {
          id: workspaceID,
        },
      });
      console.log('hasWorkspaceAuth', hasWorkspaceAuth);
      if (!hasWorkspaceAuth) {
        throw new ForbiddenException();
      }
    }

    // pass
    return true;
  }
}

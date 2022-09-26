import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';
import { AuthService } from '@/modules/auth/auth.service';
import { IUser } from '@/decorators/user.decorator';

/**
 * admin perm check guard
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private authService: AuthService,
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
      const isExit = await this.authService.fineOne({ accessToken: token });
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

    // pass
    return true;
  }
}

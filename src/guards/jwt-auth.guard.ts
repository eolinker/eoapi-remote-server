import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { isEmpty } from 'lodash';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { AuthService } from '@/modules/auth/auth.service';
import { IUser } from '@/common/decorators/user.decorator';
import { UserService } from '@/modules/user/user.service';
import { ProjectService } from '@/modules/workspace/project/project.service';
import { WorkspaceService } from '@/modules/workspace/workspace.service';

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
    private projectService: ProjectService,
    private workspaceService: WorkspaceService,
    private readonly config: ConfigService,
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
      throw new UnauthorizedException('请先登录');
    }
    try {
      // 挂载对象到当前请求上
      request.currentUser = this.jwtService.verify<IUser>(token, {
        secret: this.config.get<string>('jwt.secret'),
      });
      const isExit = await this.authService.findOne({ accessToken: token });
      const user = await this.userService.findOne({
        where: { id: request.currentUser.userId },
        select: ['passwordVersion'],
      });
      if (!isExit || user?.passwordVersion !== request.currentUser.pv) {
        throw new UnauthorizedException('您的密码已更新，请重新登录');
      }
    } catch (e) {
      console.log('JwtAuthGuard e', e);
      // 无法通过token校验
      throw new UnauthorizedException('token已失效，请重新登录');
    }
    if (isEmpty(request.currentUser)) {
      throw new UnauthorizedException('当前用户不存在');
    }

    const userID = request.currentUser.userId;

    const workspaceID = Number(
      request?.params?.workspaceID || request.headers['x-workspace-id'],
    );
    const projectID = Number(
      request?.params?.projectID || request.headers['x-project-id'],
    );
    if (Number(workspaceID) > 0) {
      const hasWorkspaceAuth = await this.workspaceService.hasWorkspaceAuth(
        workspaceID,
        userID,
      );
      if (!hasWorkspaceAuth) {
        throw new ForbiddenException('没有该空间访问权限');
      }
    }
    if (Number(projectID) > 0) {
      const hasProjectAuth = await this.projectService.hasProjectAuth(
        workspaceID,
        projectID,
        userID,
      );
      if (!hasProjectAuth) {
        throw new ForbiddenException('没有该项目访问权限');
      }
    }

    // pass
    return true;
  }
}

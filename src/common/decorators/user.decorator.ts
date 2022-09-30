import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type IUser = {
  userId: number;
  /** 密码版本 */
  pv: number;
};

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser as IUser;
  },
);

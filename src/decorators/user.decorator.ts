import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  userId: number;
}

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IUser;
  },
);

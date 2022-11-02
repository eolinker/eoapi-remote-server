import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type XHeaderType = {
  projectID: number;
  workspaceID: number;
};

type Keys = keyof XHeaderType;

export const XHeader = createParamDecorator(
  (_data: Keys, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest();
    const result: XHeaderType = {
      projectID: headers['x-project-id'],
      workspaceID: headers['x-workspace-id'],
    };
    return result[_data] ?? result;
  },
);

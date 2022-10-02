/**
 * 统一错误代码定义
 */
export const ErrorCodeMap = {
  // 10000 - 99999 业务操作错误
} as const;

export type ErrorCodeMapType = keyof typeof ErrorCodeMap;

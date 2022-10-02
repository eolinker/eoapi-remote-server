export const WORKSPACE_ID_PREFIX = ':workspaceID';
export const PROJECT_ID_PREFIX = ':projectID';

export const WORKSPACE_PROJECT_PREFIX =
  `${WORKSPACE_ID_PREFIX}/${PROJECT_ID_PREFIX}` as const;

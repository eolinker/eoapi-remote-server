export enum PermissionEnum {
  /** workspace */
  UPDATE_WORKSPACE = 'update:workspace',
  DELETE_WORKSPACE = 'delete:workspace',
  VIEW_WORKSPACE = 'view:workspace',
  ADD_WORKSPACE_MEMBER = 'add:workspace:member',
  UPDATE_WORKSPACE_MEMBER = 'update:workspace:member',
  DELETE_WORKSPACE__MEMBER = 'delete:workspace:member',

  /** project */
  VIEW_PROJECT_LIST = 'view:project:list',
  VIEW_PROJECT = 'view:project',
  UPDATE_PROJECT = 'update:project',
  DELETE_PROJECT = 'delete:project',
  IMPORT_PROJECT = 'import:project',
  EXPORT_PROJECT = 'export:project',
  ADD_PROJECT_MEMBER = 'add:project:member',
  UPDATE_PROJECT_MEMBER = 'update:project:member',
  DELETE_PROJECT__MEMBER = 'delete:project:member',

  /** apiGroup */
  VIEW_API_GROUP = 'view:apiGroup',
  CREATE_API_GROUP = 'create:apiGroup',
  UPDATE_API_GROUP = 'update:apiGroup',
  DELETE_API_GROUP = 'delete:apiGroup',

  /** apiData */
  VIEW_API_DATA = 'view:apiData',
  CREATE_API_DATA = 'create:apiData',
  UPDATE_API_DATA = 'update:apiData',
  DELETE_API_DATA = 'delete:apiData',

  /** environment */
  VIEW_ENVIRONMENT = 'view:environment',
  CREATE_ENVIRONMENT = 'create:environment',
  UPDATE_ENVIRONMENT = 'update:environment',
  DELETE_ENVIRONMENT = 'delete:environment',

  /** apiTestHistory */
  VIEW_API_TEST_HISTORY = 'view:apiTestHistory',
  CREATE_API_TEST_HISTORY = 'create:apiTestHistory',
  DELETE_API_TEST_HISTORY = 'delete:apiTestHistory',

  /** shared */
  CREATE_SHARED = 'create:shared',
  VIEW_SHARED = 'view:shared',
  DELETE_SHARED = 'delete:shared',
}

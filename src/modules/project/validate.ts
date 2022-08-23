import Ajv, { JSONSchemaType } from 'ajv';
import apiDataSchema from './schema/apiData.json';
import envSchema from './schema/env.json';
export const parseAndCheckApiData = (
  apiData,
): { validate: boolean; data?: any; error?: any } => {
  const ajv = new Ajv({
    useDefaults: true,
    removeAdditional: true,
  });
  const validate = ajv.compile(apiDataSchema);
  if (validate(apiData)) {
    return { validate: true, data: apiData };
  } else {
    console.error(validate.errors);
    return { validate: false, error: validate.errors };
  }
};

export const parseAndCheckGroup = (
  group,
): { validate: boolean; data?: any } => {
  if (group.name) {
    return {
      validate: true,
      data: {
        projectID: group.projectID,
        parentID: group.parentID,
        name: group.name,
      },
    };
  } else {
    return { validate: false };
  }
};
export const parseAndCheckEnv = (
  env,
): { validate: boolean; data?: any; error?: any } => {
  const ajv = new Ajv({
    useDefaults: true,
    removeAdditional: true,
  });
  const validate = ajv.compile<any>(envSchema);
  if (validate(env)) {
    return {
      validate: true,
      data: {
        projectID: env.projectID,
        name: env.name,
        hostUri: env.hostUri,
        parameters: env.parameters,
      },
    };
  } else {
    console.error(validate.errors);
    return { validate: false, error: validate.errors };
  }
};

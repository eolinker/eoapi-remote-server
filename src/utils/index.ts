export const fieldTypeMap = new Map<string, any>([
  ['boolean', false],
  ['array', []],
  ['object', {}],
  ['number', 0],
  ['null', null],
  ['string', 'default_value'],
]);

export type TreeToObjOpts = {
  key?: string;
  valueKey?: string;
  childKey?: string;
};

/**
 * 将树形数据转成 key => value 对象
 *
 * @param list
 * @param opts
 * @returns
 */
export const tree2obj = (
  list: any[] = [],
  opts: TreeToObjOpts = {},
  initObj = {},
) => {
  const {
    key = 'name',
    valueKey = 'description',
    childKey = 'children',
  } = opts;
  return list?.reduce?.((prev, curr) => {
    try {
      curr = typeof curr === 'string' ? JSON.parse(curr) : curr;
      prev[curr[key]] = curr[valueKey] || fieldTypeMap.get(curr.type);
      if (Array.isArray(curr[childKey]) && curr[childKey].length > 0) {
        console.log(`prev: ${prev} == curr: ${curr} == key: ${key}`);
        tree2obj(curr[childKey], opts, (prev[curr[key]] = {}));
      }
    } catch (error) {
      console.log('error==>', `prev: ${prev} == curr: ${curr} == key: ${key}`);
    }
    return prev;
  }, initObj);
};

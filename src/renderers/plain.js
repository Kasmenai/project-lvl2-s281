import _ from 'lodash';

const valueBuilder = (value, extra = '') => (_.isObject(value) ? 'complex value' : `${extra}'${value}'`);

const outputBuilders = {
  deleted: key => `Property '${key}' was removed`,
  added: (key, obj) => `Property '${key}' was added with ${valueBuilder(obj.newValue, 'value: ')}`,
  changed: (key, obj) => `Property '${key}' was updated. From ${valueBuilder(obj.oldValue)} to ${valueBuilder(obj.newValue)}`,
  hasChildren: (key, obj, fn) => `${fn(obj.children, `${key}`)}`,
};

const render = (arr, root = '') => {
  const result = arr
    .filter(({ type }) => type !== 'unchanged')
    .map((obj) => {
      const { key, type } = obj;
      const newRoot = root ? `${root}.${key}` : key;
      const outputBuilder = outputBuilders[type];
      return outputBuilder(newRoot, obj, render);
    });
  return `${result.join('\n')}`;
};

export default render;

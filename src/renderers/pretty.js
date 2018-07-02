import _ from 'lodash';

const stringify = (obj, currentDepth) => {
  if (!_.isObject(obj)) {
    return obj;
  }
  const tab = '    '.repeat(currentDepth);
  const result = _.keys(obj)
    .map(key => `${tab}    ${key}: ${stringify(obj[key], currentDepth + 1)}`).join('\n');
  return `{\n${result}\n${tab}}`;
};

const render = (arr, i = 0) => {
  const currentDepth = i;
  const tab = '    '.repeat(currentDepth);
  const result = arr.map((obj) => {
    const {
      key, oldValue, newValue, type, children,
    } = obj;
    const oldString = `${key}: ${stringify(oldValue, currentDepth + 1)}`;
    const newString = `${key}: ${stringify(newValue, currentDepth + 1)}`;
    switch (type) {
      case 'deleted':
        return `${tab}  - ${oldString}`;
      case 'added':
        return `${tab}  + ${newString}`;
      case 'changed':
        return [`${tab}  - ${oldString}`, `${tab}  + ${newString}`];
      case 'hasChildren':
        return `${tab}    ${key}: ${render(children, currentDepth + 1)}`;
      default:
        return `${tab}    ${oldString}`;
    }
  });
  return `{\n${_.flatten(result).join('\n')}\n${tab}}`;
};

export default render;

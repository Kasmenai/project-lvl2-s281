import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';


const stringify = (obj, currDepth) => {
  if (!_.isObject(obj)) {
    return obj;
  }
  const tab = '    '.repeat(currDepth);
  const qq = _.keys(obj)
    .map(key => `${tab}    ${key}: ${stringify(obj[key], currDepth + 1)}`).join('\n');
  return `{\n${qq}\n${tab}}`;
};

const render = (arr, i = 0) => {
  const currDepth = i;
  const tab = '    '.repeat(currDepth);
  const str = arr.map((obj) => {
    const {
      key, oldVal, newVal, type, children,
    } = obj;
    const oldStr = `${key}: ${stringify(oldVal, currDepth + 1)}`;
    const newStr = `${key}: ${stringify(newVal, currDepth + 1)}`;
    switch (type) {
      case 'deleted':
        return `${tab}  - ${oldStr}`;
      case 'added':
        return `${tab}  + ${newStr}`;
      case 'changed':
        return `${tab}  - ${oldStr}\n${tab}  + ${newStr}`;
      case 'hasChildren':
        return `${tab}    ${key}: ${render(children, currDepth + 1)}`;
      default:
        return `${tab}    ${oldStr}`;
    }
  }).join('\n');
  return `{\n${str}\n${tab}}`;
};

const typeActions = [
  {
    type: 'added',
    check: (key, obj1) => !_.has(obj1, key),
    process: (oldVal, newVal) => ({ oldVal: null, newVal }),
  },
  {
    type: 'deleted',
    check: (key, obj1, obj2) => !_.has(obj2, key),
    process: oldVal => ({ oldVal, newVal: null }),
  },
  {
    type: 'unchanged',
    check: (key, obj1, obj2) => obj1[key] === obj2[key],
    process: (oldVal, newVal) => ({ oldVal, newVal }),
  },
  {
    type: 'hasChildren',
    check: (key, obj1, obj2) => _.isObject(obj1[key]) && _.isObject(obj2[key]),
    process: (oldVal, newVal, f) => ({ children: f(oldVal, newVal) }),
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) => obj1[key] !== obj2[key],
    process: (oldVal, newVal) => ({ oldVal, newVal }),
  },
];

const getTypeAction = (key, obj1, obj2) => _
  .find(typeActions, ({ check }) => check(key, obj1, obj2));

const buildAST = (obj1, obj2) => {
  const allKeys = _.union(_.keys(obj1), _.keys(obj2));

  return allKeys.reduce((acc, key) => {
    const { type, process } = getTypeAction(key, obj1, obj2);
    const node = { key, type, ...process(obj1[key], obj2[key], buildAST) };
    return [...acc, node];
  }, []);
};

export default (obj1, obj2) => {
  const contentsObj1 = fs.readFileSync(obj1).toString();
  const contentsObj2 = fs.readFileSync(obj2).toString();
  const data1 = parse(contentsObj1, path.extname(obj1));
  const data2 = parse(contentsObj2, path.extname(obj2));

  const newAST = buildAST(data1, data2);
  // console.log('newAST=', newAST);
  // console.log(render(newAST));
  return render(newAST);
};

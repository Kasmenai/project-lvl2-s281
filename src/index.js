import fs from 'fs';
import { has, union, find } from 'lodash';
import path from 'path';
import parse from './parsers';

const render = (arr) => {
  const str = arr.map((obj) => {
    const {
      key, oldVal, newVal, type, children,
    } = obj;
    switch (type) {
      case 'deleted':
        return `  - ${key}: ${oldVal}`;
      case 'added':
        return `  + ${key}: ${newVal}`;
      case 'changed':
        return (children) ? `    ${key}: ${render(children)}`
          : `  - ${key}: ${oldVal}\n  + ${key}: ${newVal}`;
      default:
        return `    ${key}: ${oldVal}`;
    }
  }).join('\n');
  return `{\n${str}\n}`;
};

const typeActions = [
  {
    type: 'added',
    check: (key, obj1) => !has(obj1, key),
  },
  {
    type: 'deleted',
    check: (key, obj1, obj2) => !has(obj2, key),
  },
  {
    type: 'unchanged',
    check: (key, obj1, obj2) => obj1[key] === obj2[key],
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) => obj1[key] !== obj2[key],
  },
];

const getTypeAction = (key, obj1, obj2) => find(typeActions, ({ check }) => check(key, obj1, obj2));

const buildAST = (obj1, obj2) => {
  const allKeys = union(Object.keys(obj1), Object.keys(obj2));
  const newArr = allKeys.reduce((acc, key) => {
    const { type } = getTypeAction(key, obj1, obj2);
    if (type === 'changed' && (obj1[key] instanceof Object) && (obj2[key] instanceof Object)) {
      return [...acc, {
        key,
        oldVal: null,
        newVal: null,
        type,
        children: buildAST(obj1[key], obj2[key]),
      }];
    }
    return [...acc, {
      key,
      oldVal: obj1[key],
      newVal: obj2[key],
      type,
      children: null,
    }];
  }, []);
  return newArr;
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

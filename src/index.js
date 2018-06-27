import fs from 'fs';
import { has, union, find } from 'lodash';
import path from 'path';
import parse from './parsers';

const render = (arr) => {
  const str = arr.map((obj) => {
    const {
      key, oldVal, newVal, type,
    } = obj;
    switch (type) {
      case 'deleted':
        return `  - ${key}: ${oldVal}`;
      case 'added':
        return `  + ${key}: ${newVal}`;
      case 'changed':
        return `  - ${key}: ${oldVal}\n  + ${key}: ${newVal}`;
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

const buildArr = (obj1, obj2) => {
  const allKeys = union(Object.keys(obj1), Object.keys(obj2));
  const newArr = allKeys.reduce((acc, key) => {
    const { type } = getTypeAction(key, obj1, obj2);
    return [...acc, {
      key,
      oldVal: obj1[key],
      newVal: obj2[key],
      type,
    }];
  }, []);
  return newArr;
};

export default (obj1, obj2) => {
  const contentsObj1 = fs.readFileSync(obj1).toString();
  const contentsObj2 = fs.readFileSync(obj2).toString();
  const data1 = parse(contentsObj1, path.extname(obj1));
  const data2 = parse(contentsObj2, path.extname(obj2));

  const newArr = buildArr(data1, data2);
  // console.log(newArr);
  // console.log(render(newArr));
  return render(newArr);
};

import fs from 'fs';
import { has, union, find } from 'lodash';

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

const parse = (obj1, obj2) => {
  const allKeys = union(Object.keys(obj1), Object.keys(obj2));
  const newObj = allKeys.reduce((acc, key) => {
    const { type } = getTypeAction(key, obj1, obj2);
    return [...acc, {
      key,
      oldVal: obj1[key],
      newVal: obj2[key],
      type,
    }];
  }, []);
  return newObj;
};

export default (obj1, obj2) => {
  const contentsObj1 = fs.readFileSync(obj1).toString();
  const contentsObj2 = fs.readFileSync(obj2).toString();
  const data1 = JSON.parse(contentsObj1);
  const data2 = JSON.parse(contentsObj2);

  const newObj = parse(data1, data2);
  // console.log(newObj);
  // console.log(render(newObj));
  return render(newObj);
};

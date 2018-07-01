import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';
import render from './renderers';

const typeActions = [
  {
    type: 'added',
    check: (key, obj1) => !_.has(obj1, key),
    process: (oldValue, newValue) => ({ newValue }),
  },
  {
    type: 'deleted',
    check: (key, obj1, obj2) => !_.has(obj2, key),
    process: oldValue => ({ oldValue }),
  },
  {
    type: 'unchanged',
    check: (key, obj1, obj2) => obj1[key] === obj2[key],
    process: (oldValue, newValue) => ({ oldValue, newValue }),
  },
  {
    type: 'hasChildren',
    check: (key, obj1, obj2) => _.isObject(obj1[key]) && _.isObject(obj2[key]),
    process: (oldValue, newValue, f) => ({ children: f(oldValue, newValue) }),
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) => obj1[key] !== obj2[key],
    process: (oldValue, newValue) => ({ oldValue, newValue }),
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

export default (obj1, obj2, format) => {
  const contentsObj1 = fs.readFileSync(obj1).toString();
  const contentsObj2 = fs.readFileSync(obj2).toString();
  const data1 = parse(contentsObj1, path.extname(obj1));
  const data2 = parse(contentsObj2, path.extname(obj2));

  const newAST = buildAST(data1, data2);
  // console.log('newAST=', newAST);
  // console.log(render(newAST));
  return render(newAST, format);
};

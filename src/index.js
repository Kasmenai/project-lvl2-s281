import fs from 'fs';
import { has } from 'lodash';

const render = (obj) => {
  const unchanged = obj.unchanged.map(el => Object.keys(el).map(key => `  ${key}: ${el[key]}`));
  const added = obj.added.map(el => Object.keys(el).map(key => `+ ${key}: ${el[key]}`));
  const deleted = obj.deleted.map(el => Object.keys(el).map(key => `- ${key}: ${el[key]}`));

  const changed = obj.changed.map(el => Object.keys(el)
    .map(key => `- ${key}: ${el[key][0]}\n  + ${key}: ${el[key][1]}`));

  return `{\n  ${unchanged.join('\n  ')}\n  ${changed.join('\n  ')}\n  ${added.join('\n  ')}\n  ${deleted.join('\n  ')}\n}`;
};


export default (before, after) => {
  const contentsBefore = fs.readFileSync(before).toString();
  const contentsAfter = fs.readFileSync(after).toString();
  const BeforeObj = JSON.parse(contentsBefore);
  const AfterObj = JSON.parse(contentsAfter);
  const BeforeObjKeys = Object.keys(BeforeObj);
  const AfterObjKeys = Object.keys(AfterObj);

  const root = {
    deleted: [],
    added: [],
    changed: [],
    unchanged: [],
  };
  const allKeys = [...new Set(BeforeObjKeys.concat(AfterObjKeys))];
  const newObj = allKeys.reduce((acc, key) => {
    if (has(BeforeObj, key)) {
      if (has(AfterObj, key)) {
        return BeforeObj[key] === AfterObj[key]
          ? { ...acc, unchanged: [...acc.unchanged, { [key]: AfterObj[key] }] }
          : { ...acc, changed: [...acc.changed, { [key]: [BeforeObj[key], AfterObj[key]] }] };
      }
      return { ...acc, deleted: [...acc.deleted, { [key]: BeforeObj[key] }] };
    }
    return { ...acc, added: [...acc.added, { [key]: AfterObj[key] }] };
  }, root);
  // console.log(newObj);
  // console.log(render(newObj));
  return render(newObj);
};

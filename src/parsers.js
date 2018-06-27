import { safeLoad } from 'js-yaml';
import { parse as iniParse } from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': safeLoad,
  '.yaml': safeLoad,
  '.ini': iniParse,
};

export default (data, format) => {
  const parse = parsers[format];
  if (!parse) {
    throw new Error(`unkown format: ${format}`);
  }
  return parse(data);
};

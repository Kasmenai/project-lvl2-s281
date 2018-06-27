import { safeLoad } from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yml': safeLoad,
  '.yaml': safeLoad,
};

export default (data, format) => {
  const parse = parsers[format];
  if (!parse) {
    throw new Error(`unkown format: ${format}`);
  }
  return parse(data);
};

import plainRender from './plain';
import defaultRender from './default';

const renderers = {
  plain: plainRender,
  default: defaultRender,
};

export default (data, format = 'default') => {
  const render = renderers[format];
  if (!render) {
    throw new Error(`unkown format: ${format}`);
  }
  return render(data);
};

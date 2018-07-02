import plainRender from './plain';
import defaultRender from './pretty';

const renderers = {
  plain: plainRender,
  prettty: defaultRender,
  json: JSON.stringify,
};

export default (data, format = 'prettty') => {
  const render = renderers[format];
  if (!render) {
    throw new Error(`unkown format: ${format}`);
  }
  return render(data);
};

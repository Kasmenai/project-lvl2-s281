import plainRender from './plain';
import prettyRender from './pretty';

const renderers = {
  plain: plainRender,
  pretty: prettyRender,
  json: JSON.stringify,
};

export default (data, format = 'pretty') => {
  const render = renderers[format];
  if (!render) {
    throw new Error(`unkown format: ${format}`);
  }
  return render(data);
};

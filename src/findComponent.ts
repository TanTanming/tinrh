import { getWidgetInfo } from './widget';

interface IObject {
  [key: string]: any;
}

export const findComponent = (componentName: string) => {
  const files: IObject = getWidgetInfo();
  let c;
  Object.keys(files).forEach((fileName) => {
    const componentConfig: IObject = files[fileName];
    if (componentConfig.default.name === componentName) {
      c = componentConfig.default || componentConfig;
    }
  });
  return c;
};

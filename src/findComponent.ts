import { getFileInfo } from './widget';

interface IObject {
  [key: string]: any;
}
const files: IObject = getFileInfo();

export const findComponent = (componentName: string) => {
  console.log(files, 'files');

  let c;
  Object.keys(files).forEach((fileName) => {
    const componentConfig: IObject = files[fileName];
    if (componentConfig.default.name === componentName) {
      c = componentConfig.default || componentConfig;
    }
  });
  return c;
};

import { App } from 'vue';
import { setWidgetFile } from './widget';

function registerWidgets(files: any) {
  setWidgetFile(files);
  const comps: any = {};
  Object.keys(files).forEach((fileName) => {
    const componentConfig: any = files[fileName];
    const componentName = componentConfig.default.name;
    comps[componentName] = componentConfig.default || componentConfig;
  });
  return {
    install: (app: App) => {
      Object.keys(comps).forEach((key: any) => {
        app.component(key, comps[key]);
      });
    },
  };
}
export default registerWidgets;

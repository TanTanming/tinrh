import { App } from 'vue';
import { setWidgetFile } from './widget';

function registerWidgets(files: any) {
  if (!files) {
    throw new Error('registerWidgets: files is required');
  }
  setWidgetFile(files);
  const comps: Record<string, any> = {};
  Object.keys(files).forEach((fileName) => {
    const componentConfig: Record<string, any> = files[fileName];
    const componentName = componentConfig.default.name;
    comps[componentName] = componentConfig.default || componentConfig;
  });
  return {
    install: (app: App) => {
      Object.keys(comps).forEach((key: string) => {
        app.component(key, comps[key]);
      });
    },
  };
}
export default registerWidgets;

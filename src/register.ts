import { App } from 'vue';
import { setFile } from './render';

function register(files: any) {
  if (!files) {
    throw new Error('register: files is required');
  }
  setFile(files);
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
export default register;
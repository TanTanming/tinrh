// import { App } from 'vue';
import { setFile } from './render';

/**
 * @description 注册组件
 * @param files 组件集合
 */

async function register(files: any, plugins: any[] = []) {
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
    install: (app: any) => {
      Object.keys(comps).forEach((key: string) => {
        app.component(key, comps[key]);
      });
      if (plugins.length > 0) {
        plugins.forEach((item: any) => {
          app.use(item);
        });
      }
    },
  };
}
export default register;

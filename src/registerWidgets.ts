import { App } from 'vue';

const comps: any = {};
const files: any = (import.meta as any).glob('@/widgets/**/index.vue', {
  eager: true,
});
console.log(files, '组件');

Object.keys(files).forEach((fileName) => {
  const componentConfig: any = files[fileName];
  const componentName = componentConfig.default.name;
  comps[componentName] = componentConfig.default || componentConfig;
});

export default {
  install: (app: App) => {
    Object.keys(comps).forEach((key: any) => {
      app.component(key, comps[key]);
    });
  },
};

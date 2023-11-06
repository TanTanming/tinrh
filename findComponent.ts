interface IObject {
  [key: string]: any;
}

export const findComponent = (componentName: string) => {
  let files: IObject;
  if (typeof (import.meta as IObject).env === 'object') {
    console.log('使用Vite');
    files = (import.meta as IObject).glob('@/widgets/**/index.vue', {
      eager: true,
    });
  } else {
    console.log('使用Webpack或未知构建工具');
    files = (require as any)?.context('@/widgets', true, /index.vue$/);
  }

  let c;
  Object.keys(files).forEach((fileName) => {
    const componentConfig: IObject = files[fileName];
    if (componentConfig.default.name === componentName) {
      c = componentConfig.default || componentConfig;
    }
  });
  return c;
};

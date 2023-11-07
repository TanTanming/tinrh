interface IObject {
  [key: string]: any;
}

export const findComponent = (componentName: string) => {
  const files = (import.meta as IObject).glob('@/widgets/**/index.vue', {
    eager: true,
  });

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

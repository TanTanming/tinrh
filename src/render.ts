// import { createApp, nextTick, ref } from 'vue';
import { nanoid } from 'nanoid';
import { findComponent } from './findComponent';
import { usev } from './getVue';
const { createApp, nextTick, ref } = usev;
type Component = import('vue').DefineComponent<{}, {}, any>;

const instance: Record<string, any> = ref({});
const files: any = ref(null);
const librars = ref();

export const setFile = (f: any[]) => {
  files.value = f;
};

export const getComponentInfo = () => files.value;

export const setLibrars = (list: any) => {
  librars.value = list;
};
/**
 * @description 挂载组件
 * @param componentName 组件名称
 * @param targetSelector 挂载节点名称
 * @param options 传递给组件的参数
 * @returns 当前组件
 */
export const R = async (
  componentName: string,
  targetSelector: string,
  options: Record<string, any> = {}
) => {
  return new Promise(async (resolve, reject) => {
    const targetElement: HTMLElement | null =
      document.getElementById(targetSelector);
    if (!targetElement) {
      // console.error(
      //   `Target element with selector '${targetSelector}' not found.`
      // );
      reject(`Target element with selector '${targetSelector}' not found.`);
    }

    const c: Component | undefined = findComponent(componentName);
    if (!c) {
      // console.error(`Component '${componentName}' not found.`);
      reject(`Component '${componentName}' not found.`);
    }

    const map = deepClone(c!);
    map.parent = targetElement;
    options.closeId = nanoid();

    const div = document.createElement('div');
    div.setAttribute('id', options.closeId);
    map.closeId = options.closeId;
    targetElement!.appendChild(div);

    nextTick(() => {
      const app = createApp(map.default || map, options);
      const plugins = librars.value;
      debugger;
      if (plugins) {
        // app.use(plugins);
        plugins.forEach((item: any) => {
          app.use(item);
          debugger;
        });
      }

      app.mount(div);
      debugger;
      console.log(`'${componentName}' Component mounted successfully.`);
      console.log('librars plugin', plugins, app);
      instance!.value[options.closeId] = map;
      resolve({ [options.closeId]: map });
    });
  });
};

/**
 * @description 销毁指定组件
 * @param key 组件的closeId
 * @returns
 */
export const destroy = (key: string) => {
  if (!instance.value || !instance.value[key]) return;
  instance.value[key].parent?.removeChild(document.getElementById(key));
  delete instance.value[key];
  console.log(`'${key}' Component uninstalled successfully.`);
};

/**
 * @description 销毁所有组件
 */
export const destroyAll = () => {
  const keys = Object.keys(instance.value);
  if (!instance.value || keys.length === 0) return;
  keys.forEach((key: string) => {
    let childElements = instance.value[key].parent.children;
    while (childElements.length > 0) {
      instance.value[key].parent.removeChild(childElements[0]);
    }
    delete instance.value[key];
  });
  instance.value = {};
  console.log('All component are closed.', instance.value);
};

/**
 * @description 获取所有组件
 * @returns 所有组件信息
 */
export const getInstance = () => instance.value;

/**
 * @description 简单版深拷贝
 * @param obj
 * @returns 拷贝后的数据
 */
export const deepClone = (obj: Record<string, any>) => {
  const result: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepClone(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
};

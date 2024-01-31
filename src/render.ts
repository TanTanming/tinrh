import { createApp, h, ref } from 'vue';
import { nanoid } from 'nanoid';
import { findComponent } from './findComponent';
type Component = import('vue').DefineComponent<{}, {}, any>;

const instance: Record<string, any> | null = ref({});
const files: any = ref(null);

export const setFile = (f: any[]) => {
  files.value = f;
};

export const getComponentInfo = () => files.value;

/**
 * @description 挂载组件
 * @param componentName 组件名称
 * @param targetSelector 挂载节点名称
 * @param options 传递给组件的参数
 * @returns 当前组件
 */
export const R = (
  componentName: string,
  targetSelector: string,
  options: Record<string, any> = {}
) => {
  const targetElement: HTMLElement | null =
    document.getElementById(targetSelector);
  if (!targetElement) {
    console.error(
      `Target element with selector '${targetSelector}' not found.`
    );
    return;
  }
  const c: Component = findComponent(componentName)!;
  if (!c) {
    console.error(`Component '${componentName}' not found.`);
    return;
  }
  const map = deepClone(c);
  map.parent = targetElement;
  options.closeId = nanoid();
  options.containter = targetElement;

  const div: HTMLElement = document.createElement('div');
  div.setAttribute('id', options.closeId);
  map.closeId = options.closeId;
  targetElement.appendChild(div);
  const app = createApp({
    render() {
      return h(map.default || map, options);
    },
  });

  app.mount(div);
  console.log(`'${componentName}' Component mounted successfully.`);
  instance.value[options.closeId] = map;
  return {
    [options.closeId]: map,
  };
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

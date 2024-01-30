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

export const destroy = (key: string) => {
  if (!instance.value || !instance.value[key]) return;
  instance.value[key].parent?.removeChild(document.getElementById(key));
  delete instance.value[key];
  console.log(`'${key}' Component uninstalled successfully.`);
};

export const destroyAll = () => {
  const keys = Object.keys(instance.value);
  if (!instance.value || keys.length === 0) return;
  keys.forEach((key: string) =>
    instance.value[key].parent?.removeChild(document.getElementById(key))
  );
  instance.value = {};
  console.log('All component are closed.');
};

export const getInstance = () => instance.value;

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

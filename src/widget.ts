import { createApp, h, ref } from 'vue';
import { nanoid } from 'nanoid';
import { findComponent } from './findComponent';
type Component = import('vue').DefineComponent<{}, {}, any>;

const widgetsObj: Record<string, any> | null = ref({});
const files: any = ref(null);

export const setWidgetFile = (f: any[]) => {
  files.value = f;
};

export const getWidgetInfo = () => files.value;

export const openWidget = (
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
  const widget = deepClone(c);
  widget.parent = targetElement;
  options.closeId = nanoid();

  const div: HTMLElement = document.createElement('div');
  div.setAttribute('id', options.closeId);
  widget.closeId = options.closeId;
  targetElement.appendChild(div);
  const app = createApp({
    render() {
      return h(widget.default || widget, options);
    },
  });

  app.mount(div);
  console.log(`Widget '${componentName}' 挂载成功.`);
  widgetsObj.value[options.closeId] = widget;
  return {
    closeId: widget,
  };
};

export const closeWidget = (key: string) => {
  if (!widgetsObj.value || !widgetsObj.value[key]) return;
  widgetsObj.value[key].parent?.removeChild(document.getElementById(key));
  delete widgetsObj.value[key];
  console.log(`Widget '${key}' 卸载成功.`);
};

export const closeAllWidgets = () => {
  if (!widgetsObj.value) return;
  Object.keys(widgetsObj.value).forEach((key: string) => {
    widgetsObj.value[key].parent?.removeChild(document.getElementById(key));
  });
  widgetsObj.value = {};
  console.log('All widgets are closed.');
};

export const getActiveWidgets = () => widgetsObj.value;

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

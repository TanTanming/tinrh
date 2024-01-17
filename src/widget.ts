import { createApp, h, ref } from 'vue';
import { nanoid } from 'nanoid';
import { findComponent } from './findComponent';
type Component = import('vue').DefineComponent<{}, {}, any>;

const widgetsObj: Record<string, any> = ref({});
const files: any = ref(null);

export const setWidgetFile = (f: any[]) => {
  files.value = f;
};

export const getWidgetInfo = () => {
  return files.value;
};

export const openWidget = (
  componentName: string,
  targetSelector: string,
  options: Record<string, any> = {}
) => {
  const targetElement: HTMLElement | null =
    document.getElementById(targetSelector);
  const c: Component = findComponent(componentName)!;
  const widget = deepClone(c);
  widget.parent = targetElement;
  options.closeId = nanoid();

  if (!targetElement) {
    console.error(
      `Target element with selector '${targetSelector}' not found.`
    );
    return;
  }
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
  widgetsObj.value[options.closeId] = widget;
};

export const closeWidget = (key: string) => {
  widgetsObj.value[key].parent?.removeChild(document.getElementById(key));
  delete widgetsObj.value[key];
};

export const closeAllWidgets = () => {
  Object.keys(widgetsObj.value).forEach((key: string) => {
    widgetsObj.value[key].parent?.removeChild(document.getElementById(key));
  });
  widgetsObj.value = {};
};
export const getActiveWidgets = () => {
  return widgetsObj.value;
};

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

import { createApp, h, ref } from 'vue';
import { findComponent } from './findComponent';

const widgetsList: any = ref([]);
const files = ref([]);

export const setWidgetFile = (f: any) => {
  files.value = f;
};

export const getWidgetInfo = () => {
  return files.value;
};

export const openWidget = (
  componentName: string,
  targetSelector: string,
  options = {}
) => {
  const targetElement = document.getElementById(targetSelector);
  const c: any = findComponent(componentName);
  const widget = deepClone(c);
  widget.parent = targetElement;

  if (!targetElement) {
    console.error(
      `Target element with selector '${targetSelector}' not found.`
    );
    return;
  }
  const div = document.createElement('div');
  div.setAttribute('id', `${targetSelector}-${componentName}`);
  widget.closeId = `${targetSelector}-${componentName}`;
  targetElement.appendChild(div);
  const app = createApp({
    render() {
      return h(widget.default || widget, options);
    },
  });

  app.mount(div);
  widgetsList.value.push(widget);
};

export const closeWidget = (widgetName: string) => {
  const item = widgetsList.value.find(
    (item: Record<string, any>) => item.name === widgetName
  );
  if (!item) return;
  const target = document.getElementById(item.closeId);
  item.parent?.removeChild(target);

  widgetsList.value = widgetsList.value.filter(
    (item: Record<string, any>) => item.name !== widgetName
  );
};

export const closeAllWidgets = () => {
  widgetsList.value.forEach((item: Record<string, any>) => {
    closeWidget(item.name);
  });

  widgetsList.value = [];
};
export const getActiveWidgets = () => {
  return widgetsList.value;
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

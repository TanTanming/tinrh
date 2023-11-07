import { createApp, h, ref } from 'vue';
import { findComponent } from './findComponent';

const widgetsList: any = ref([]);
const files = ref([]);

export const widgetFile = (f: any) => {
  files.value = f;
};

export const getFileInfo = () => {
  return files.value;
};

export const openWidget = (componentName: string, targetSelector: string) => {
  const targetElement = document.getElementById(targetSelector);
  const c: any = findComponent(componentName);
  const widget = deepClone(c);
  console.log(widget, componentName, c, 'widget');

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
      return h(widget.default || widget);
    },
  });

  app.mount(div);
  widgetsList.value.push(widget);
};

export const closeWidget = (widgetName: string) => {
  widgetsList.value.forEach((item: Record<string, any>) => {
    if (item.name === widgetName) {
      const target = document.getElementById(item.closeId);
      item.parent?.removeChild(target);
    }
  });

  widgetsList.value = widgetsList.value.filter(
    (item: Record<string, any>) => item.name !== widgetName
  );
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

import { nanoid } from 'nanoid';
import { findComponent } from './findComponent';

type Component = import('vue').DefineComponent<{}, {}, any>;
interface IStyledElement {
  withStyle(styles: Record<string, any>): IStyledElement;
  widthContent(text: string): IStyledElement;
  withAttribute(attrName: string, attrValue: string): IStyledElement;
  withAttributes([...attrName], [...attrValue]): IStyledElement;
  appendTo(parentElement: HTMLElement): IStyledElement;
  getElement(): HTMLElement;
  inheritEvents(): IStyledElement;
}
let instance: Record<string, any> = {};
let files: any = null;
let librars: [] = [];
let vue: Record<string, any> = {};

export const resolveFn = (v: Record<string, any>) => (vue = v);
export const setFile = (f: any[]) => (files = f);

export const getComponentInfo = () => files;

export const setLibrars = (list: any) => {
  librars = list;
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
    const { createApp, nextTick } = vue;

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

    // const div = document.createElement('div');
    // div.setAttribute('id', options.closeId);
    map.closeId = options.closeId;
    const div = customElement('div')
      .withAttribute('id', options.closeId)
      .appendTo(targetElement!)
      .getElement();
    // targetElement!.appendChild(div);

    nextTick(() => {
      const app = createApp(map.default || map, options);
      const plugins = librars;
      if (plugins) {
        plugins.forEach((item: any) => {
          app.use(item);
        });
      }

      app.mount(div);
      console.log(`'${componentName}' Component mounted successfully.`);
      instance![options.closeId] = map;
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
  if (!instance || !instance[key]) return;
  instance[key].parent?.removeChild(document.getElementById(key));
  delete instance[key];
  console.log(`'${key}' Component uninstalled successfully.`);
};

/**
 * @description 销毁所有组件
 */
export const destroyAll = () => {
  const keys = Object.keys(instance);
  if (!instance || keys.length === 0) return;
  keys.forEach((key: string) => {
    let childElements = instance[key].parent.children;
    while (childElements.length > 0) {
      instance[key].parent.removeChild(childElements[0]);
    }
    delete instance[key];
  });
  instance = {};
  console.log('All component are closed.', instance);
};

/**
 * @description 获取所有组件
 * @returns 所有组件信息
 */
export const getInstance = () => instance;

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

/**
 * @description 创建元素
 * @param tagName 元素标签名
 * @returns HTMLElement
 */
export const customElement = (tagName: string) => {
  const element: HTMLElement = document.createElement(tagName);
  const styledElement: IStyledElement = {
    withStyle(styles: Record<string, any>) {
      Object.assign(element.style, styles);
      return styledElement;
    },
    widthContent(text: string) {
      element.textContent = text;
      return styledElement;
    },
    withAttribute(attrName: string, attrValue: string) {
      element.setAttribute(attrName, attrValue);
      return styledElement;
    },
    withAttributes([...attrName], [...attrValue]) {
      attrName.forEach((name, index) => {
        element.setAttribute(name, attrValue[index]);
      });
      return styledElement;
    },
    appendTo(parentElement: HTMLElement) {
      parentElement.appendChild(element);
      return styledElement;
    },
    getElement(): HTMLElement {
      return element;
    },
    inheritEvents() {
      for (const key in element) {
        if (
          typeof element[key as keyof HTMLElement] === 'function' &&
          key.startsWith('on')
        ) {
          styledElement[key as keyof IStyledElement] = (
            element[key as keyof HTMLElement] as Function
          ).bind(element);
        }
      }
      return styledElement;
    },
  };

  return styledElement;
};

/**
 * @description 隐藏组件
 * @param key 组件的closeId
 * @param isActive false隐藏组件，true显示组件
 */
export const aliveComponent = (key: string, isActive: boolean) => {
  const element = document.getElementById(key);
  if (!element) {
    throw new Error(`${key} is not found`);
  }
  element.style.display = isActive ? 'black' : 'none';
};

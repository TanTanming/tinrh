import {
  R,
  destroy,
  getInstance,
  deepClone,
  getComponentInfo,
  setFile,
  destroyAll,
  setLibrars,
  resolveFn,
  customElement,
  aliveComponent,
} from './render';
import {
  sendMessage,
  reciveMessage,
  offMessage,
  clearAllMessage,
  installMS,
  destroyMS,
} from './store';
import { findComponent } from './findComponent';
import register from './register';

export {
  resolveFn,
  R,
  destroy,
  getInstance,
  deepClone,
  findComponent,
  register,
  getComponentInfo,
  setFile,
  destroyAll,
  sendMessage,
  reciveMessage,
  offMessage,
  clearAllMessage,
  installMS,
  destroyMS,
  setLibrars,
  customElement,
  aliveComponent,
};

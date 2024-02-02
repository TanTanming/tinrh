import {
  R,
  destroy,
  getInstance,
  deepClone,
  getComponentInfo,
  setFile,
  destroyAll,
  setLibrars,
} from './render';
import { getVue } from './getVue';
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
  getVue,
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
};

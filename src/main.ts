import {
  R,
  destroy,
  getInstance,
  deepClone,
  getComponentInfo,
  setFile,
  destroyAll,
  registerLibrars,
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
  registerLibrars,
};

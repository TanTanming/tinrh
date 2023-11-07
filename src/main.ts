document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    widget
  </div>
`;

import {
  openWidget,
  closeWidget,
  getActiveWidgets,
  deepClone,
  getFileInfo,
  setWidgetFile,
} from './widget';
import { findComponent } from './findComponent';
import registerWidgets from './registerWidgets';

export {
  openWidget,
  closeWidget,
  getActiveWidgets,
  deepClone,
  findComponent,
  registerWidgets,
  getFileInfo,
  setWidgetFile,
};

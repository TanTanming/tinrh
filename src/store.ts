import { ref } from 'vue';
import { nanoid } from 'nanoid';

declare global {
  interface Window {
    indexedDB: IDBFactory;
    mozIndexedDB: IDBFactory;
    webkitIndexedDB: IDBFactory;
    msIndexedDB: IDBFactory;
  }
}
interface ITask {
  pathID: string;
  messageName: string;
  value: Record<string, any>;
  status: string;
}

const msName = 'msDatabase';
let dbVersion = 1;
// const tempVersion = 1;
const msStore: any = ref(null);
// DMS defaultMessageStore
const sname = ref('DMS');
/**
 *
 * @description 创建消息中心
 * @returns 创建的消息中心
 */
// remove = true,
const installMS = (): Promise<IDBDatabase> => {
  let request: IDBOpenDBRequest;
  let MS: IDBDatabase | null = null;
  let store: IDBObjectStore | null = null;
  // let transaction: IDBTransaction | null = null;
  // sname.value = storeName;
  // const storeName = 'defaultStore';

  return new Promise<IDBDatabase>((resolve, reject) => {
    const MSDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    if (!MSDB) {
      reject('您的浏览器暂不支持 [messageStore] 通信功能');
    }
    console.log('db', dbVersion, sname.value);

    request = MSDB.open(msName, dbVersion);
    // console.log(MSDB, 'indexedDB');

    request.onerror = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      console.error('打开/创建消息中心失败！', target.error);
      reject(target.error);
    };

    request.onsuccess = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      MS = target.result;
      msStore.value = MS;
      resolve(msStore.value);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const target = event.target as IDBOpenDBRequest;
      MS = target.result;
      store = MS.createObjectStore(sname.value, {
        keyPath: 'messageName',
        autoIncrement: true,
      });
      msStore.value = MS;
      store.createIndex('messageName', 'messageName', { unique: false });
      store.createIndex('pathID', 'pathID', { unique: false });
      resolve(msStore.value);
    };
  });
};

/**
 * @description 销毁消息中心
 */
const destroyMS = () => {
  if (!msStore.value) {
    return;
  }
  msStore.value.close();
  const deleteRequest = indexedDB.deleteDatabase(msName);
  deleteRequest.onsuccess = () => {
    msStore.value = null;
    dbVersion++;
    sname.value = nanoid();
  };
  deleteRequest.onerror = () => {
    console.error('messageStore 销毁失败！');
  };
};

/**
 *
 * @returns 获取存储库
 */
const getStore = async () => {
  return !msStore.value
    ? null
    : msStore.value
        ?.transaction(sname.value, 'readwrite')
        .objectStore(sname.value);
};

/**
 *
 * @param messageName 消息名称
 * @param value 消息内容
 * @description 发送数据
 */
const sendMessage = async (messageName: string, value: Record<string, any>) => {
  let store = await getStore();
  if (!store) {
    console.error('messageStore is not initialized！');
    return;
  }
  let request: IDBOpenDBRequest;
  const task: ITask = {
    pathID: nanoid(),
    messageName,
    value,
    status: 'pending',
  };

  request = store?.get(messageName);
  request.onsuccess = function () {
    updateMessage(store, task);
  };
  request.onerror = function () {
    addMessage(store, task);
  };
};

/**
 *
 * @param store 存储库
 * @param task 更新的数据
 * @returns 更新对应消息队列数据
 */
const updateMessage = (store: IDBObjectStore, task: Record<string, any>) =>
  store.put(task);

/**
 *
 * @param store 存储库
 * @param task 添加的数据
 * @returns 添加新创建的消息队列数据
 */
const addMessage = (store: IDBObjectStore, task: Record<string, any>) =>
  store.add(task);

/**
 *
 * @param messageName 消息名称
 * @returns 对应消息队列的数据
 * @description 接收数据
 */
const reciveMessage = (messageName: string) => {
  return new Promise(async (resolve, reject) => {
    const store = await getStore();
    if (!store) {
      console.error('messageStore is not initialized！');
      reject(null);
    }
    const request: IDBOpenDBRequest = store.get(messageName);
    request.onsuccess = (event: Event) => {
      const data: ITask = (event.target as any)!.result;
      const res = data.value || null;
      resolve(res);
    };
    request.onerror = () => {
      console.error('获取数据失败！');
      reject(null);
    };
  });
};

/**
 *
 * @param messageName 消息名称
 * @returns
 * @description 卸载指定消息
 */
const offMessage = async (messageName: string) => {
  const store = await getStore();
  if (!store) {
    console.error('messageStore is not initialized！');
    return;
  }
  const request: IDBOpenDBRequest = store?.delete(messageName);
  request.onsuccess = (event: Event) => {
    console.log((event.target as any).result, `${messageName}事件已卸载`);
  };
  request.onerror = () => {
    console.error('数据删除失败');
  };
};

/**
 *
 * @description 清空存储库所有数据
 */
const clearAllMessage = async () => {
  const store = await getStore();
  if (!store) {
    console.error('messageStore is not initialized！');
    return;
  }
  const request: IDBOpenDBRequest = store?.clear();
  request.onsuccess = (event: Event) => {
    console.log((event.target as any).result, '消息事件已清空！');
  };
  request.onerror = () => {
    console.error('消息事件清空失败！');
  };
};

export {
  sendMessage,
  reciveMessage,
  offMessage,
  clearAllMessage,
  installMS,
  destroyMS,
};

export interface LocalStorage {
  get: (key: string) => null | any;
  set: (key: string, item: any) => void;
  remove: (key: string) => void;
}

export const useLocalStorage = (): LocalStorage => {
  const set = (key: string, item: any): void => {
    window.localStorage.setItem(key, JSON.stringify(item));
  };

  const get = (key: string): any => {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item);
  };

  const remove = (key: string): void => {
    window.localStorage.removeItem(key);
  };

  return { set, get, remove };
};

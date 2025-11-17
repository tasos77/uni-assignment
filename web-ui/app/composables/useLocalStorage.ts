// Composable for interacting with local storage
export interface LocalStorage {
  get: (key: string) => null | any;
  set: (key: string, item: any) => void;
  remove: (key: string) => void;
}

// Local storage composable implementation
export const useLocalStorage = (): LocalStorage => {
  // Set item in local storage
  const set = (key: string, item: any): void => {
    window.localStorage.setItem(key, JSON.stringify(item));
  };

  // Get item from local storage
  const get = (key: string): any => {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item);
  };

  // Remove item from local storage
  const remove = (key: string): void => {
    window.localStorage.removeItem(key);
  };

  return { set, get, remove };
};

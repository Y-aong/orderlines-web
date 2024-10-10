export const setStorage = (item: any, key: string) => {
  if (typeof item === "object") {
    localStorage.setItem(key, JSON.stringify(item));
  } else if (typeof item === "number") {
    localStorage.setItem(key, item.toString());
  } else if (typeof item === "string") {
    localStorage.setItem(key, item);
  } else if (item == null) {
    localStorage.setItem(key, "");
  } else if (typeof item === "undefined") {
    localStorage.setItem(key, "");
  } else if (typeof item === "boolean") {
    localStorage.setItem(key, "1");
  } else {
    console.log(`item::${item}数据类型不明${typeof item}`);
  }
};

export const getStorage = (key: string, type: string) => {
  const item: string | null = localStorage.getItem(key);
  if (type == "dict") {
    try {
      return JSON.parse(item as string);
    } catch (e) {
      return {};
    }
  }
  if (type === "list") {
    try {
      return JSON.parse(item as string);
    } catch (e) {
      return [];
    }
  } else if (type === "int") {
    try {
      return Number(item);
    } catch (e) {
      return 0;
    }
  } else if (type === "bool") {
    return item == "true";
  } else if (type == "str") {
    return item;
  }
};

//存储数据
export const SET_TOKEN = (token: string) => {
  localStorage.setItem("TOKEN", token);
};
//本地存储获取数据
export const GET_TOKEN = () => {
  return localStorage.getItem("TOKEN");
};

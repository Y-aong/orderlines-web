import http from "@/api";

//项目用户相关的请求地址
enum API {
  PLUGIN_URL = "/plugin_info"
}

export const getPluginRequest = (data: any) =>
  http.get(`${API.PLUGIN_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`);

export const createPluginRequest = (data: any) => http.post(API.PLUGIN_URL, data);

export const updatePluginRequest = (data: any) => http.put(API.PLUGIN_URL, data);

export const deletePluginRequest = (data: any) => http.delete(API.PLUGIN_URL, { params: data });

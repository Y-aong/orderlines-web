import http from "@/api";

//项目用户相关的请求地址
enum API {
  PLUGIN_URL = "/plugin_info",
  PLUGIN_EXPORT_URL = "/export/plugin"
}

export const PluginExport = (data: any) => http.download(API.PLUGIN_EXPORT_URL, data);
export const getPluginRequest = (data: any) => http.get(API.PLUGIN_URL, data);
export const createPluginRequest = (data: any) => http.post(API.PLUGIN_URL, data);
export const updatePluginRequest = (data: any) => http.put(API.PLUGIN_URL, data);
export const deletePluginRequest = (data: any) => http.delete(`${API.PLUGIN_URL}?id=${data.id}`);

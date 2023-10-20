import http from "@/api";
import { Plugin } from "./type";

//项目用户相关的请求地址
enum API {
  PLUGIN_URL = "/plugin_info",
  PLUGIN_EXPORT_URL = "/export/plugin"
}

export const PluginExport = (data: Plugin.PluginFilter) => http.download(API.PLUGIN_EXPORT_URL, data);
export const getPluginRequest = (data: Plugin.PluginFilter) => http.get<Plugin.PluginItem>(API.PLUGIN_URL, data);
export const createPluginRequest = (data: Plugin.PluginItem) => http.post(API.PLUGIN_URL, data);
export const updatePluginRequest = (data: Plugin.PluginItem) => http.put(API.PLUGIN_URL, data);
export const deletePluginRequest = (data: Plugin.PluginItem) => http.delete(`${API.PLUGIN_URL}?id=${data.id}`);

import http from "@/api";
import { Conf } from "./type";

//项目用户相关的请求地址
enum API {
  SYSTEM_SETTING = "/conf",
  SYSTEM_SETTING_EXPORT = "/export/conf"
}

export const SystemSettingExport = (data: Conf.ConfFilter) => http.download(API.SYSTEM_SETTING_EXPORT, data);
export const getSystemSettingRequest = (data: Conf.ConfFilter) => http.get<Conf.ConfItem>(API.SYSTEM_SETTING, data);
export const createSystemSettingRequest = (data: Conf.ConfItem) => http.post(API.SYSTEM_SETTING, data);
export const updateSystemSettingRequest = (data: Conf.ConfItem) => http.put(API.SYSTEM_SETTING, data);
export const deleteSystemSettingRequest = (data: Conf.ConfItem) => http.delete(API.SYSTEM_SETTING, { params: data });

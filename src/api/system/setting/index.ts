import http from "@/api";
import { Conf } from "./type";

//项目用户相关的请求地址
enum API {
  SYSTEM_CONFIG = "/conf/",
  SYSTEM_CONFIG_DETAIL = "/conf/detail",
  SYSTEM_CONFIG_EXPORT = "conf/export"
}

export const SystemSettingExport = (data: Conf.ConfFilter) => http.download(API.SYSTEM_CONFIG_EXPORT, data);
export const SystemSettingDetailRequest = (id: number) => http.download(`${API.SYSTEM_CONFIG_EXPORT}?id=${id}`);
export const getSystemSettingRequest = (data: Conf.ConfFilter) => http.get<Conf.ConfItem>(API.SYSTEM_CONFIG, data);
export const createSystemSettingRequest = (data: Conf.ConfItem) => http.post(API.SYSTEM_CONFIG, data);
export const updateSystemSettingRequest = (data: Conf.ConfItem) => http.put(API.SYSTEM_CONFIG, data);
export const deleteSystemSettingRequest = (id: number) => http.delete(`${API.SYSTEM_CONFIG}?id=${id}`);

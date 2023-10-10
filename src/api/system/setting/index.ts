import http from "@/api";

//项目用户相关的请求地址
enum API {
  SYSTEM_SETTING = "/conf"
}

export const getSystemSettingRequest = (data: any) =>
  http.get(`${API.SYSTEM_SETTING}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`);

export const createSystemSettingRequest = (data: any) => http.post(API.SYSTEM_SETTING, data);

export const updateSystemSettingRequest = (data: any) => http.put(API.SYSTEM_SETTING, data);

export const deleteSystemSettingRequest = (data: any) => http.delete(API.SYSTEM_SETTING, { params: data });

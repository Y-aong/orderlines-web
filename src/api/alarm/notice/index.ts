import http from "@/api";
import { AlarmNotice } from "./type.js";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  ALARM_NOTICE_CONFIG_URL = "/alarm/notice/config"
}

export const getAlarmNoticeRequest = (data: AlarmNotice.Filter) =>
  http.get<BaseData>(API.ALARM_NOTICE_CONFIG_URL, data);
export const createAlarmNoticeRequest = (data: AlarmNotice.AlarmNoticeItem) =>
  http.post<BaseData>(API.ALARM_NOTICE_CONFIG_URL, data);
export const updateAlarmNoticeRequest = (data: AlarmNotice.AlarmNoticeItem) =>
  http.put<BaseData>(API.ALARM_NOTICE_CONFIG_URL, data);
export const deleteAlarmNoticeRequest = (id: number) =>
  http.delete<DeleteData>(`${API.ALARM_NOTICE_CONFIG_URL}?id=${id}`);

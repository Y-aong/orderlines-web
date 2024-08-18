import http from "@/api";
import { Notice } from "./type";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  ALARM_URL = "/notice/alarm/",
  ALARM_DETAIL_URL = "/notice/alarm/detail",
  ALARM_MESSAGE_URL = "/notice/alarm_message",
  LOGGER_URL = "/notice/logger",
  LOGGER_DETAIL_URL = "/notice/logger/detail"
}

export const getAlarmDetailRequest = (id: number) => http.get<Notice.AlarmItem>(`${API.ALARM_URL}?id=${id}`);
export const getAlarmMessageRequest = () => http.get<Notice.AlarmItem[]>(API.ALARM_MESSAGE_URL);
export const getAlarmRequest = (data: Notice.AlarmFilter) => http.get<BaseData>(API.ALARM_URL, data);
export const updateAlarmRequest = (data: Notice.AlarmItem) => http.put<BaseData>(API.ALARM_URL, data);
export const deleteAlarmRequest = (id: number) => http.delete<DeleteData>(`${API.ALARM_URL}?id=${id}`);

export const getLoggerDetailRequest = (id: number) => http.get<Notice.LoggerItem>(`${API.LOGGER_DETAIL_URL}?id=${id}`);
export const getLoggerRequest = (data: Notice.LoggerFilter) => http.get<Notice.LoggerItem[]>(API.LOGGER_URL, data);
export const updateLoggerRequest = (data: Notice.LoggerItem) => http.put<BaseData>(API.LOGGER_URL, data);
export const deleteLoggerRequest = (id: number) => http.delete<DeleteData>(`${API.LOGGER_URL}?id=${id}`);

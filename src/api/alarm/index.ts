import http from "@/api";
import { Alarm } from "./type";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  ALARM_URL = "/alarm/",
  ALARM_DETAIL_URL = "/alarm/detail"
}

export const getAlarmDetailRequest = (id: number) => http.get<Alarm.AlarmItem>(`${API.ALARM_URL}?id=${id}`);
export const getAlarmRequest = (data: Alarm.AlarmFilter) => http.get<BaseData>(API.ALARM_URL, data);
export const updateAlarmRequest = (data: Alarm.AlarmItem) => http.put<BaseData>(API.ALARM_URL, data);
export const deleteAlarmRequest = (id: number) => http.delete<DeleteData>(`${API.ALARM_URL}?id=${id}`);

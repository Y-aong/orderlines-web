import http from "@/api";
import { Alarm } from "./type";

//项目用户相关的请求地址
enum API {
  ALARM_URL = "/alarm"
}

export const getAlarmRequest = (data: Alarm.AlarmFilter) => http.get<Alarm.AlarmResponse>(API.ALARM_URL, data);
export const updateAlarmRequest = (data: Alarm.AlarmItem) => http.put(API.ALARM_URL, data);
export const deleteAlarmRequest = (data: Alarm.AlarmItem) => http.delete(`${API.ALARM_URL}?id=${data.id}`);

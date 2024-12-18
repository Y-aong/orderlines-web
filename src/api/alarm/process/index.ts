import http from "@/api";
import { ProcessAlarm } from "./type";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  PROCESS_ALARM_URL = "/alarm/process/",
  PROCESS_ALARM_DETAIL_URL = "/alarm/process/detail",
  ALARM_MESSAGE_URL = "/alarm/message"
}

export const getProcessAlarmDetailRequest = (id: number) =>
  http.get<ProcessAlarm.AlarmItem>(`${API.PROCESS_ALARM_URL}?id=${id}`);
export const getAlarmMessageRequest = () => http.get<ProcessAlarm.AlarmItem[]>(API.ALARM_MESSAGE_URL);
export const getProcessAlarmRequest = (data: ProcessAlarm.AlarmFilter) =>
  http.get<BaseData>(API.PROCESS_ALARM_URL, data);
export const updateProcessAlarmRequest = (data: ProcessAlarm.AlarmItem) =>
  http.put<BaseData>(API.PROCESS_ALARM_URL, data);
export const deleteProcessAlarmRequest = (id: number) => http.delete<DeleteData>(`${API.PROCESS_ALARM_URL}?id=${id}`);

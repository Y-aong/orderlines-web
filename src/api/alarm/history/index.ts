import http from "@/api";
import { AlarmHistory } from "./type";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  ALARM_HISTORY_URL = "/alarm/prometheus/history"
}

export const getAlarmHistoryRequest = (data: AlarmHistory.Filter) =>
  http.get<AlarmHistory.AlarmNoticeResponse>(API.ALARM_HISTORY_URL, data);
export const updateAlarmHistoryRequest = (data: AlarmHistory.AlarmHistoryItem) =>
  http.put<BaseData>(API.ALARM_HISTORY_URL, data);
export const deleteAlarmHistoryRequest = (id: number) => http.delete<DeleteData>(`${API.ALARM_HISTORY_URL}?id=${id}`);

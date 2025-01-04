import http from "@/api";
import { AlarmAudit } from "./type";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  ALARM_AUDIT_URL = "/alarm/audit"
}

export const getAlarmAuditRequest = (data: AlarmAudit.Filter) => http.get<BaseData>(API.ALARM_AUDIT_URL, data);
export const createAlarmAuditRequest = (data: AlarmAudit.AlarmAuditItem) =>
  http.post<BaseData>(API.ALARM_AUDIT_URL, data);
export const updateAlarmAuditRequest = (data: AlarmAudit.AlarmAuditItem) =>
  http.put<BaseData>(API.ALARM_AUDIT_URL, data);
export const deleteAlarmAuditRequest = (id: number) => http.delete<DeleteData>(`${API.ALARM_AUDIT_URL}?id=${id}`);

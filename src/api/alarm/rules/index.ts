import http from "@/api";
import { AlarmRules } from "./type";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  ALARM_RULE_URL = "/alarm/rule",
  ALARM_RULE_DETAIL_URL = "/alarm/rule/detail"
}
//获取规则详情
export const getAlarmRuleDetailRequest = (id: number) =>
  http.get<AlarmRules.RuleItem>(`${API.ALARM_RULE_URL}?id=${id}`);
// 获取规则列表
export const createAlarmRuleRequest = (data: AlarmRules.Filter) => http.post<BaseData>(API.ALARM_RULE_URL, data);
// 创建告警规则
export const getAlarmRuleRequest = (data: AlarmRules.Filter) => http.get<BaseData>(API.ALARM_RULE_URL, data);
// 更新告警规则
export const updateAlarmRuleRequest = (data: AlarmRules.Filter) => http.put<BaseData>(API.ALARM_RULE_URL, data);
// 删除告警规则
export const deleteAlarmRulesRequest = (id: number) => http.delete<DeleteData>(`${API.ALARM_RULE_URL}?id=${id}`);

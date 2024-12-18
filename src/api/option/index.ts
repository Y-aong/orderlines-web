import http from "@/api";
import { Option } from "./type";

enum API {
  PROCESS_NAME_OPTION = "/option/process_name",
  PROCESS_VERSION_OPTION = "/option/process_version",
  GROUP_OWNER_OPTION = "/option/group_owner",
  PROCESS_NAMESPACE_OPTION = "/option/namespace_process",
  PROCESS_OPTION = "/option/process",
  VARIABLE_OPTION = "/option/variable",
  SUB_PROCESS_OPTION = "/option/sub_process",
  PROCESS_ID_OPTION = "/option/process_id",
  PLUGIN_OPTION = "/option/setup_teardown",
  PROCESS_CONTROL = "/option/next_node",
  PREV_NODE_RESULT = "/option/prev_node",
  PROMETHEUS_JOB_URL = "/option/prometheus/job",
  PROMETHEUS_INSTANCE_URL = "/option/prometheus/instance",
  ALARM_NOTICE_NAME_URL = "/option/notice_name",
  ALARM_NOTICE_GROUP_URL = "/option/notice_group",
  USER_NAME_URL = "/option/user"
}
// 获取流程名称options
export const getProcessNameOptionRequest = () => http.get<Option.OptionResponse>(API.PROCESS_NAME_OPTION);

// 获取群组owner options
export const getGroupOwnerOptionRequest = () => http.get<Option.OptionResponse>(API.GROUP_OWNER_OPTION);

// 获取流程版本options
export const getProcessVersionOptionRequest = (process_name: string) =>
  http.get<Option.OptionResponse>(`${API.PROCESS_VERSION_OPTION}?process_name=${process_name}`);

// 获取当前命名空间的流程
export const getProcessNameSpaceOptionRequest = (namespace: string) =>
  http.get<Option.OptionResponse>(`${API.PROCESS_NAMESPACE_OPTION}?namespace=${namespace}`);

// 获取流程选项
export const getProcessOptionRequest = () => http.get<Option.OptionResponse>(API.PROCESS_OPTION);

// 获取变量选项
export const getProcessVariableOptionRequest = (process_id: string) =>
  http.get<Option.OptionResponse>(`${API.VARIABLE_OPTION}?process_id=${process_id}`);

// 获取子流程信息
export const getSubProcessOptionRequest = (process_id: string) =>
  http.get<Option.OptionResponse>(`${API.SUB_PROCESS_OPTION}?process_id=${process_id}`);

// 获取子流程id
export const getProcessIDOptionRequest = () => http.get<Option.OptionResponse>(`${API.PROCESS_ID_OPTION}`);

// 获取子流程id
export const getSetupTearDownOptionRequest = () => http.get<Option.OptionResponse>(`${API.PLUGIN_OPTION}`);

// 获取流程控制的后续节点选项
export const getPCNextNodeOptionRequest = (task_id: string, process_id: string) =>
  http.get<Option.NextNode>(`${API.PROCESS_CONTROL}?task_id=${task_id}&process_id=${process_id}`);

// 获取前一个流程节点的结果选项
export const getPrevNodeResultOptionRequest = (task_id: string, process_id: string) =>
  http.get<Option.PrevNodeResult>(`${API.PREV_NODE_RESULT}?task_id=${task_id}&process_id=${process_id}`);

// 获取告警job名称
export const getAlarmJobOptRequest = () => http.get<Option.OptionResponse>(`${API.PROMETHEUS_JOB_URL}`);
// 获取告警instance名称
export const getAlarmInstanceOptRequest = () => http.get<Option.OptionResponse>(`${API.PROMETHEUS_INSTANCE_URL}`);
// 获取告警job名称
export const getAlarmNoticeOptRequest = () => http.get<Option.OptionResponse>(`${API.ALARM_NOTICE_NAME_URL}`);
// 获取告警instance名称
export const getAlarmNoticeGroupOptRequest = () => http.get<Option.OptionResponse>(`${API.ALARM_NOTICE_GROUP_URL}`);
// 获取用户名称选项
export const getUserNameOptRequest = () => http.get<Option.OptionResponse>(`${API.USER_NAME_URL}`);

import http from "@/api";

enum API {
  PROCESS_NAME_OPTION = "/option/process_name",
  PROCESS_VERSION_OPTION = "/option/process_version",
  GROUP_OWNER_OPTION = "/option/group_owner_opt",
  PROCESS_NAMESPACE_OPTION = "/option/namespace_process_opt",
  PROCESS_OPTION = "/option/process_opt",
  VARIABLE_OPTION = "/option/variable_opt"
}
// 获取流程名称options
export const getProcessNameOptionRequest = () => http.get(API.PROCESS_NAME_OPTION);
// 获取群组owner options
export const getGroupOwnerOptionRequest = () => http.get(API.GROUP_OWNER_OPTION);
// 获取流程版本options
export const getProcessVersionOptionRequest = (process_name: string) =>
  http.get(`${API.PROCESS_VERSION_OPTION}?process_name=${process_name}`);
// 获取当前命名空间的流程
export const getProcessNameSpaceOptionRequest = (namespace: string) =>
  http.get(`${API.PROCESS_NAMESPACE_OPTION}?namespace=${namespace}`);
// 获取流程选项
export const getProcessOptionRequest = () => http.get(API.PROCESS_OPTION);
// 获取变量选项
export const getProcessVariableOptionRequest = (process_id: string) =>
  http.get(`${API.VARIABLE_OPTION}?process_id=${process_id}`);

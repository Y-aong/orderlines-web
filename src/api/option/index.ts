import http from "@/api";
import { Option } from "./type";

enum API {
  PROCESS_NAME_OPTION = "/option/process_name_opt",
  PROCESS_VERSION_OPTION = "/option/process_version_opt",
  GROUP_OWNER_OPTION = "/option/group_owner_opt",
  PROCESS_NAMESPACE_OPTION = "/option/namespace_process_opt",
  PROCESS_OPTION = "/option/process_opt",
  VARIABLE_OPTION = "/option/variable_opt",
  SUB_PROCESS_OPTION = "/option/sub_process_opt",
  PROCESS_ID_OPTION = "/option/process_id_opt",
  PLUGIN_OPTION = "/option/setup_teardown/options",
  PROCESS_CONTROL = "/option/next_node_opt",
  PREV_NODE_RESULT = "/graph/prev_node_opt"
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

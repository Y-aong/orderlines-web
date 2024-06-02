import http from "@/api";
import { NodeMenu, TaskNodeNS, ProcessVersionOptionType } from "./type";

enum API {
  PLUGIN_NODE = "/node_menu",
  TASK_NODE = "/task_node",
  FLOW_TASK_CONFIG = "/flow_task_config",
  FLOW_DATA = "/flow_data",
  FLOW_SAVE = "/flow_save",
  RunningTask = "/running_task",
  TASK_INSTANCE_DETAIL = "/task_instance_detail",
  PROCESS_VERSION_OPTION = "/option/process_version",
  PROCESS_VERSION = "/process_version"
}

// 获取正在运行的节点线
export const getRunningTaskRequest = (RunningTaskFilter: TaskNodeNS.FlowDataFilter) =>
  http.get(API.RunningTask, RunningTaskFilter);

// 获取节点菜单
export const getNodeMenuRequest = () => http.get<NodeMenu>(`${API.PLUGIN_NODE}`);
// 获取节点参数
export const getTaskNodeRequest = (taskNode: TaskNodeNS.TaskNodeParam) =>
  http.get<TaskNodeNS.TaskNode>(API.TASK_NODE, taskNode);

// 获取任务节点
export const getFlowTaskDataRequest = (process_id: string, task_id: string) =>
  http.get(`${API.FLOW_TASK_CONFIG}?process_id=${process_id}&task_id=${task_id}`);

// 创建任务节点
export const createTaskFlowDataRequest = (flow_data: any) => http.post(API.FLOW_TASK_CONFIG, flow_data);

// 流程图任务配置
export const getFlowDataRequest = (data: TaskNodeNS.FlowDataFilter) => http.get(API.FLOW_DATA, data);

// 创建流程图信息
export const createFlowDataRequest = (flow_data: any) => http.post(API.FLOW_DATA, flow_data);

// 保存流程
export const saveFlowRequest = (data: any) => http.post(API.FLOW_SAVE, data);

// 获取任务实例根据流程实例id和任务id
export const getTaskInstanceItem = (process_instance_id: string, task_id: string) =>
  http.get(`${API.TASK_INSTANCE_DETAIL}?process_instance_id=${process_instance_id}&task_id=${task_id}`);

// 获取流程版本
export const getProcessVersionOptionRequest = (process_name: string) =>
  http.get<ProcessVersionOptionType[]>(`${API.PROCESS_VERSION_OPTION}?process_name=${process_name}`);

// 创建流程版本
export const createProcessVersionRequest = (data: any) => http.post(API.PROCESS_VERSION, data, { loading: true });

export const getProcessVersionRequest = (process_id: string) =>
  http.get(`${API.PROCESS_VERSION}?process_id=${process_id}`);

export const getProcessVersionByNameRequest = (process_name: string) =>
  http.get(`${API.PROCESS_VERSION}?process_name=${process_name}`);

export const updateProcessModeRequest = (process_name: string) =>
  http.get(`${API.PROCESS_VERSION}?process_name=${process_name}`);

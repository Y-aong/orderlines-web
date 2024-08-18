import http from "@/api";
import { TaskNodeNS } from "./type";
import { NodeMenuType } from "@/stores/interface";
import { BaseData } from "@/api/interface";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";

enum API {
  PLUGIN_NODE = "/flow/node_menu",
  TASK_NODE = "/flow/task_node",
  FLOW_TASK_CONFIG = "/flow/task_config",
  FLOW_DATA = "/flow/data",
  FLOW_SAVE = "/orderlines/save",
  PROCESS_VERSION = "/flow/process_version",
  PROCESS_PARAM_URL = "/flow/process_param"
}

// 获取节点菜单
export const getNodeMenuRequest = () => http.get<NodeMenuType[]>(`${API.PLUGIN_NODE}`);

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

// 创建流程版本
export const createProcessVersionRequest = (data: any) => http.post(API.PROCESS_VERSION, data, { loading: true });

export const getProcessVersionRequest = (process_id: string) =>
  http.get(`${API.PROCESS_VERSION}?process_id=${process_id}`);

export const getProcessVersionByNameRequest = (process_name: string) =>
  http.get(`${API.PROCESS_VERSION}?process_name=${process_name}`);

export const updateProcessModeRequest = (process_name: string) =>
  http.get(`${API.PROCESS_VERSION}?process_name=${process_name}`);

// 修改流程参数
export const updateProcessParamRequest = (data: Process.ProcessParamType) =>
  http.put<BaseData>(API.PROCESS_PARAM_URL, data);

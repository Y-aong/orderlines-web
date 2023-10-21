import http from "@/api";
import { NodeMenu, TaskNodeNS } from "./type";

enum API {
  PLUGIN_NODE = "/node_menu",
  TASK_NODE = "/task_node",
  FLOW_TASK_CONFIG = "/flow_task_config",
  FLOW_DATA = "/flow_data",
  FLOW_SAVE = "/flow_save"
}

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
export const getFlowDataRequest = (process_id: string) => http.get(`${API.FLOW_DATA}?process_id=${process_id}`);

// 创建流程图信息
export const createFlowDataRequest = (flow_data: any) => http.post(API.FLOW_DATA, flow_data);

// 保存流程
export const saveFlowRequest = (flow_data: any) => http.post(API.FLOW_SAVE, flow_data);

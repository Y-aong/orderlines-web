import http from "@/api";
import { TaskNodeType, VariableItemType } from "@/api/flow/type";

//项目用户相关的请求地址
enum API {
  PLUGIN_NODE = "/node_menu",
  TASK_NODE = "/task_node",
  VARIABLE = "/variable",
  PROCESS_VARIABLE = "/process_variable",
  START_PROCESS = "/orderlines/start",
  STOP_PROCESS = "/orderlines/stop",
  PAUSED_PROCESS = "/orderlines/paused",
  RECOVER_PROCESS = "/orderlines/recover",
  TASK = "/task",
  FLOW_TASK_CONFIG = "/flow_task_config",
  FLOW_DATA = "/flow_data",
  FLOW_SAVE = "/flow_save",
  PROCESS_CONTROL = "/process_control",
  PREV_NODE_RESULT = "/prev_node_result",
  VARIABLE_OPTION = "/variable_option"
}

// 获取节点菜单
export const getNodeMenuRequest = () => http.get(`${API.PLUGIN_NODE}`);
// 获取节点参数
export const getTaskNodeRequest = (pluginNode: any) => http.get(API.TASK_NODE, pluginNode);

// 获取任务变量
export const getVariableRequest = (process_id: string) => http.get(`${API.PROCESS_VARIABLE}?process_id=${process_id}`);
export const getVariableDetailRequest = (id: number) => http.get(`${API.VARIABLE}?id=${id}&pre_page=10&page=1`);
export const createVariableRequest = (data: VariableItemType) => http.post(API.VARIABLE, data);
export const updateVariableRequest = (data: VariableItemType) => http.put(API.VARIABLE, data);
export const deleteVariableRequest = (t_id: number) => http.delete(`${API.VARIABLE}?id=${t_id}`);

// 流程操作，tabbar中操作
export const startProcessRequest = (process_id: string | number) => {
  if (typeof process_id === "string") {
    return http.post(API.START_PROCESS, { process_id: process_id });
  } else {
    return http.post(API.START_PROCESS, { id: process_id });
  }
};

export const stopProcessRequest = (process_instance_id: string) =>
  http.post(API.STOP_PROCESS, { process_instance_id: process_instance_id });

export const pausedProcessRequest = (process_instance_id: string) =>
  http.post(API.PAUSED_PROCESS, { process_instance_id: process_instance_id });

export const recoverProcessRequest = (process_instance_id: string) =>
  http.post(API.RECOVER_PROCESS, { process_instance_id: process_instance_id });

// 任务节点
export const createTaskRequest = (taskNode: TaskNodeType) => http.post(API.TASK, taskNode);

export const updateTaskRequest = (taskNode: TaskNodeType) => http.put(API.TASK, taskNode);

export const getTaskRequest = (task_id: number) => http.get(`${API.TASK}?task_id=${task_id}`);

export const deleteTaskRequest = (task_id: number) => http.delete(`${API.TASK}?task_id=${task_id}`);

// 流程图任务配置
export const getFlowTaskDataRequest = (process_id: string, task_id: string) =>
  http.get(`${API.FLOW_TASK_CONFIG}?process_id=${process_id}&task_id=${task_id}`);

export const createTaskFlowDataRequest = (flow_data: any) => http.post(API.FLOW_TASK_CONFIG, flow_data);

// 流程图任务配置
export const getFlowDataRequest = (process_id: string) => http.get(`${API.FLOW_DATA}?process_id=${process_id}`);

export const createFlowDataRequest = (flow_data: any) => http.post(API.FLOW_DATA, flow_data);

// 保存流程
export const saveFlowRequest = (flow_data: any) => http.post(API.FLOW_SAVE, flow_data);

// 获取流程控制的后续节点
export const getProcessControlRequest = (task_id: string, process_id: string) =>
  http.post(`${API.PROCESS_CONTROL}?task_id=${task_id}&process_id=${process_id}`);

export const getPrevNodeResultRequest = (task_id: string, process_id: string) =>
  http.get(`${API.PREV_NODE_RESULT}?task_id=${task_id}&process_id=${process_id}`);

export const getVariableOptionRequest = (process_id: string) =>
  http.get(`${API.VARIABLE_OPTION}?process_id=${process_id}`);

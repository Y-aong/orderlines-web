import http from "@/api";

//项目用户相关的请求地址
enum API {
  FLOW_TASK_CONFIG = "/flow_task_config",
  FLOW_DATA = "/flow_data",
  FLOW_SAVE = "/flow_save"
}
// 流程图任务配置
export const getFlowTaskDataRequest = (process_id: string, task_id: string) =>
  http.get(`${API.FLOW_TASK_CONFIG}?process_id=${process_id}&task_id=${task_id}`);

export const createTaskFlowDataRequest = (flow_data: any) => http.post(API.FLOW_TASK_CONFIG, flow_data);

// 流程图任务配置
export const getFlowDataRequest = (process_id: string) => http.get(`${API.FLOW_DATA}?process_id=${process_id}`);

export const createFlowDataRequest = (flow_data: any) => http.post(API.FLOW_DATA, flow_data);

// 保存流程
export const saveFlowRequest = (flow_data: any) => http.post(API.FLOW_SAVE, flow_data);

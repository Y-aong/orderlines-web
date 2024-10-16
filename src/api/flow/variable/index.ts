import http from "@/api";

import { FlowVariable } from "./type";

enum API {
  VARIABLE = "/orderlines/variable",
  PROCESS_VARIABLE = "/flow/process_variable",
  PROCESS_INSTANCE_VARIABLE = "/flow/process_variable_instance"
}

// 根据流程ID获取任务变量
export const getVariableRequest = (process_id: string) =>
  http.get<FlowVariable.VariableItem[]>(`${API.PROCESS_VARIABLE}?process_id=${process_id}`);

// 根据流程实例ID获取任务变量
export const getVariableInstanceRequest = (process_instance_id: string) =>
  http.get<FlowVariable.VariableItem[]>(`${API.PROCESS_INSTANCE_VARIABLE}?process_instance_id=${process_instance_id}`);
// 获取变量详情
export const getVariableDetailRequest = (id: number) => http.get(`${API.VARIABLE}?id=${id}`);
// 新增变量
export const createVariableRequest = (data: FlowVariable.VariableItem) => http.post(API.VARIABLE, data);
// 更新变量
export const updateVariableRequest = (data: FlowVariable.VariableItem) => http.put(API.VARIABLE, data);
// 删除变量
export const deleteVariableRequest = (t_id: number) => http.delete(`${API.VARIABLE}?id=${t_id}`);

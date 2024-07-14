import http from "@/api";

import { FlowVariable } from "./type";

enum API {
  VARIABLE = "/variable",
  PROCESS_VARIABLE = "/orderlines/process_variable"
}

// 获取任务变量
export const getVariableRequest = (process_id: string) =>
  http.get<FlowVariable.VariableItem>(`${API.PROCESS_VARIABLE}?process_id=${process_id}`);
export const getVariableDetailRequest = (id: number) => http.get(`${API.VARIABLE}?id=${id}`);
export const createVariableRequest = (data: FlowVariable.VariableItem) => http.post(API.VARIABLE, data);
export const updateVariableRequest = (data: FlowVariable.VariableItem) => http.put(API.VARIABLE, data);
export const deleteVariableRequest = (t_id: number) => http.delete(`${API.VARIABLE}?id=${t_id}`);

import http from "@/api";
import { VariableItemType } from "@/api/flow/type";

//项目用户相关的请求地址
enum API {
  VARIABLE = "/variable",
  VARIABLE_OPTION = "/variable_option"
}

// 获取任务变量
export const getVariableRequest = () => http.get(`${API.VARIABLE}`);
export const getVariableDetailRequest = (id: number) => http.get(`${API.VARIABLE}?id=${id}&pre_page=10&page=1`);
export const createVariableRequest = (data: VariableItemType) => http.post(API.VARIABLE, data);
export const updateVariableRequest = (data: VariableItemType) => http.put(API.VARIABLE, data);
export const deleteVariableRequest = (t_id: number) => http.delete(`${API.VARIABLE}?id=${t_id}`);

export const getVariableOptionRequest = (process_id: string) => {
  http.get(`${API.VARIABLE_OPTION}?process_id=${process_id}`);
};

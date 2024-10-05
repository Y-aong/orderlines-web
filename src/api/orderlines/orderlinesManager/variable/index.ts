import http from "@/api";
import { Variable } from "./type";
import { DeleteData, BaseData } from "@/api/interface";

enum API {
  VARIABLE_URL = "/orderlines/variable",
  VARIABLE_DETAIL_URL = "/orderlines/variable/detail",
  VARIABLE_INSTANCE_URL = "/orderlines/variable_instance/detail",
  VARIABLE_INSTANCE_EXPORT = "/orderlines/variable/export"
}
// 导出变量信息
export const variableExport = (data: Variable.VariableFilter) => http.download(API.VARIABLE_INSTANCE_EXPORT, data);
// 获取变量列表信息
export const getVariableRequest = (data: Variable.VariableFilter) =>
  http.get<Variable.VariableItem[]>(API.VARIABLE_URL, data);
// 获取变量详情信息，根据流程实例id和变量key
export const getVariableInstanceDetailRequest = (process_instance_id: string, variable_key: string) =>
  http.get<Variable.VariableItem>(
    `${API.VARIABLE_INSTANCE_URL}?process_instance_id=${process_instance_id}&variable_key=${variable_key}`
  );
// 获取变量详情信息，根据变量id
export const getVariableDetailRequest = (id: number) =>
  http.get<Variable.VariableItem>(`${API.VARIABLE_DETAIL_URL}?id=${id}`);
// 创建流程变量
export const createVariableRequest = (data: Variable.VariableItem) => http.post<BaseData>(API.VARIABLE_URL, data);
// 修改流程变量
export const updateVariableRequest = (data: Variable.VariableItem) => http.put<BaseData>(API.VARIABLE_URL, data);
// 删除流程变量
export const deleteVariableRequest = (id: number) => http.delete<DeleteData>(`${API.VARIABLE_URL}?id=${id}`);

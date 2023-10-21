import http from "@/api";
import { Variable } from "./type";

enum API {
  VARIABLE_URL = "/variable",
  VARIABLE_INSTANCE_EXPORT = "/export/variable"
}

export const variableExport = (data: Variable.VariableFilter) => http.download(API.VARIABLE_INSTANCE_EXPORT, data);
export const getVariableRequest = (data: Variable.VariableFilter) =>
  http.get<Variable.VariableItem>(API.VARIABLE_URL, data);
export const getVariableDetailRequest = (id: number) => http.get(`${API.VARIABLE_URL}?id=${id}`);
export const createVariableRequest = (data: Variable.VariableItem) => http.post(API.VARIABLE_URL, data);
export const updateVariableRequest = (data: Variable.VariableItem) => http.put(API.VARIABLE_URL, data);
export const deleteVariableRequest = (id: number) => http.delete(`${API.VARIABLE_URL}?id=${id}`);

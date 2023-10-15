import http from "@/api";

enum API {
  VARIABLE_URL = "/variable",
  VARIABLE_INSTANCE_EXPORT = "/export/variable"
}

export const variableExport = (data: any) => http.download(API.VARIABLE_INSTANCE_EXPORT, data);
export const getVariableRequest = (data: any) => http.get(API.VARIABLE_URL, data);
export const createVariableRequest = (data: any) => http.post(API.VARIABLE_URL, data);
export const updateVariableRequest = (data: any) => http.put(API.VARIABLE_URL, data);
export const deleteVariableRequest = (data: any) => http.delete(`${API.VARIABLE_URL}?id=${data.id}`);

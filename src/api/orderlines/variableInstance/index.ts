import http from "@/api";

enum API {
  VARIABLE_INSTANCE_URL = "/variable_instance",
  VARIABLE_EXPORT_URL = "/export/variable_instance"
}

export const VariableInstanceExport = (data: any) => http.download(API.VARIABLE_EXPORT_URL, data);
export const getVariableInstanceRequest = (data: any) => http.get(API.VARIABLE_INSTANCE_URL, data);
export const createVariableInstanceRequest = (data: any) => http.post(API.VARIABLE_INSTANCE_URL, data);
export const updateVariableInstanceRequest = (data: any) => http.put(API.VARIABLE_INSTANCE_URL, data);
export const deleteVariableInstanceRequest = (data: any) => http.delete(`${API.VARIABLE_INSTANCE_URL}?id=${data.id}`);

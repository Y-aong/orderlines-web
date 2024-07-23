import http from "@/api";
import { VariableInstance } from "./type";

enum API {
  VARIABLE_INSTANCE_URL = "/orderlines/variable_instance",
  VARIABLE_EXPORT_URL = "/orderlines/variable_instance/export"
}

export const VariableInstanceExport = (data: VariableInstance.VariableInstanceFilter) =>
  http.download(API.VARIABLE_EXPORT_URL, data);
export const getVariableInstanceRequest = (data: VariableInstance.VariableInstanceFilter) =>
  http.get<VariableInstance.VariableInstanceItem>(API.VARIABLE_INSTANCE_URL, data);
export const createVariableInstanceRequest = (data: VariableInstance.VariableInstanceItem) =>
  http.post(API.VARIABLE_INSTANCE_URL, data);
export const updateVariableInstanceRequest = (data: VariableInstance.VariableInstanceItem) =>
  http.put(API.VARIABLE_INSTANCE_URL, data);
export const deleteVariableInstanceRequest = (data: VariableInstance.VariableInstanceItem) =>
  http.delete(`${API.VARIABLE_INSTANCE_URL}?id=${data.id}`);

import http from "@/api";

import { PInstance } from "./type";

//项目用户相关的请求地址
enum API {
  PROCESS_INSTANCE_URL = "/process_instance",
  PROCESS_OPTION_URL = "/process_option",
  EXPORT_URL = "/process_instance/html/export",
  INSTANCE_EXPORT_URL = "/process_instance/export"
}

export const downExport = (id: number) => http.download(API.EXPORT_URL, { id: id });
export const processInstanceExport = () => http.download(API.INSTANCE_EXPORT_URL);
export const getProcessOptionRequest = () => http.get<PInstance.ProcessOption>(`${API.PROCESS_OPTION_URL}`);
export const getProcessInstanceRequest = (data: PInstance.ProcessInstanceFilter) =>
  http.get<PInstance.ProcessInstanceItem>(API.PROCESS_INSTANCE_URL, data);
export const createProcessInstanceRequest = (data: PInstance.ProcessInstanceItem) =>
  http.post(API.PROCESS_INSTANCE_URL, data);
export const updateProcessInstanceRequest = (data: PInstance.ProcessInstanceItem) =>
  http.put(API.PROCESS_INSTANCE_URL, data);
export const deleteProcessInstanceRequest = (data: PInstance.ProcessInstanceItem) =>
  http.delete(`${API.PROCESS_INSTANCE_URL}?id=${data.id}`);

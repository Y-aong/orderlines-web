import http from "@/api";

import { PInstance } from "./type";

//项目用户相关的请求地址
enum API {
  PROCESS_INSTANCE_URL = "/orderlines/process_instance",
  PROCESS_INSTANCE_DETAIL_URL = "/orderlines/process_instance/detail",
  EXPORT_URL = "/orderlines/process_export",
  INSTANCE_EXPORT_URL = "/orderlines/process_instance/export"
}
// 导出流程报告
export const downExport = (process_instance_id: string) =>
  http.download(API.EXPORT_URL, { process_instance_id: process_instance_id });
// 导出流程实例
export const processInstanceExport = () => http.download(API.INSTANCE_EXPORT_URL);
// 获取流程实例详情
export const getProcessInstanceDetailRequest = (id: string) =>
  http.get<PInstance.ProcessInstanceItem>(`${API.PROCESS_INSTANCE_DETAIL_URL}?id=${id}`);
// 获取流程实例列表
export const getProcessInstanceRequest = (data: PInstance.ProcessInstanceFilter) =>
  http.get<PInstance.ProcessInstanceItem>(API.PROCESS_INSTANCE_URL, data);
// 创建流程实例
export const createProcessInstanceRequest = (data: PInstance.ProcessInstanceItem) =>
  http.post(API.PROCESS_INSTANCE_URL, data);
// 更新流程实例
export const updateProcessInstanceRequest = (data: PInstance.ProcessInstanceItem) =>
  http.put(API.PROCESS_INSTANCE_URL, data);
// 删除流程实例
export const deleteProcessInstanceRequest = (id: string) => http.delete(`${API.PROCESS_INSTANCE_URL}?id=${id}`);

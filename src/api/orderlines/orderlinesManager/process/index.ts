import http from "@/api";
import { BaseData, DeleteData } from "@/api/interface";
import { Process } from "./type";

enum API {
  PROCESS_URL = "/orderlines/process",
  PROCESS_DETAIL_URL = "/orderlines/process/detail",
  PROCESS_EXPORT_URL = "/orderlines/export/process",
  PROCESS_HTML_EXPORT_URL = "/orderlines/process_export"
}
// 导出流程报告
export const processHtmlExport = (data: Process.ProcessHtmlFilter) => http.download(API.PROCESS_HTML_EXPORT_URL, data);
// 导出流程信息
export const processExport = (data: Process.ProcessFilter) => http.download(API.PROCESS_EXPORT_URL, data);
// 获取流程列表
export const getProcessRequest = (data: Process.ProcessFilter) => http.get<Process.ProcessItem>(API.PROCESS_URL, data);
// 获取流程详情
export const getProcessDetailRequest = (process_id: string) =>
  http.get<Process.ProcessItem>(`${API.PROCESS_DETAIL_URL}?process_id=${process_id}`);
// 创建流程
export const createProcessRequest = (data: Process.ProcessItem) => http.post<BaseData>(API.PROCESS_URL, data);
// 修改流程
export const updateProcessRequest = (data: Process.ProcessItem) => http.put<BaseData>(API.PROCESS_URL, data);
// 删除流程
export const deleteProcessRequest = (id: string) => http.delete<DeleteData>(`${API.PROCESS_URL}?id=${id}`);

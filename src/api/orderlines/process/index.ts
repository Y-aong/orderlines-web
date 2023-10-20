import http from "@/api";
import { Process } from "@/api/orderlines/process/type";

//项目用户相关的请求地址
enum API {
  PROCESS_URL = "/process",
  PROCESS_EXPORT_URL = "/export/process"
}

export const processExport = (data: Process.ProcessFilter) => http.download(API.PROCESS_EXPORT_URL, data);
export const getProcessRequest = (data: Process.ProcessFilter) => http.get<Process.ProcessItem>(API.PROCESS_URL, data);
export const createProcessRequest = (data: Process.ProcessItem) => http.post(API.PROCESS_URL, data);
export const updateProcessRequest = (data: Process.ProcessItem) => http.put(API.PROCESS_URL, data);
export const deleteProcessRequest = (data: Process.ProcessItem) => http.delete(`${API.PROCESS_URL}?id=${data.id}`);

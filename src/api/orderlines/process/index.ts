import http from "@/api";
import { ResultData, BaseUpdate } from "@/api/interface";
import { Process } from "@/api/orderlines/process/type";

//项目用户相关的请求地址
enum API {
  PROCESS_URL = "/process",
  PROCESS_PARAM_URL = "/process_param",
  PROCESS_EXPORT_URL = "/export/process"
}

export const processExport = (data: Process.ProcessFilter) => http.download(API.PROCESS_EXPORT_URL, data);
export const getProcessRequest = (data: Process.ProcessFilter) => http.get<Process.ProcessItem>(API.PROCESS_URL, data);
export const createProcessRequest = (data: Process.ProcessItem) =>
  http.post<ResultData<BaseUpdate>>(API.PROCESS_URL, data);
export const updateProcessRequest = (data: Process.ProcessItem) =>
  http.put<ResultData<BaseUpdate>>(API.PROCESS_URL, data);
export const deleteProcessRequest = (data: Process.ProcessItem) =>
  http.delete<ResultData<BaseUpdate>>(`${API.PROCESS_URL}?id=${data.id}`);
export const updateProcessParamRequest = (data: Process.ProcessParamType) =>
  http.put<ResultData<BaseUpdate>>(API.PROCESS_PARAM_URL, data);

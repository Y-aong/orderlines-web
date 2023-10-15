import http from "@/api";

//项目用户相关的请求地址
enum API {
  PROCESS_URL = "/process",
  PROCESS_EXPORT_URL = "/export/process"
}

export const processExport = (data: any) => http.download(API.PROCESS_EXPORT_URL, data);
export const getProcessRequest = (data: any) => http.get(API.PROCESS_URL, data);
export const createProcessRequest = (data: any) => http.post(API.PROCESS_URL, data);
export const updateProcessRequest = (data: any) => http.put(API.PROCESS_URL, data);
export const deleteProcessRequest = (data: any) => http.delete(`${API.PROCESS_URL}?id=${data.id}`);

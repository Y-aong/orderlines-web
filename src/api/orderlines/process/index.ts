import http from "@/api";
import { DeleteRequest } from "@/api/responseType";
import { ProcessItemType, queryProcessType } from "./type";

//项目用户相关的请求地址
enum API {
  PROCESS_URL = "/process"
}

export const getProcessRequest = (data: queryProcessType) =>
  http.get(`${API.PROCESS_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`);

export const createProcessRequest = (data: ProcessItemType) => http.post(API.PROCESS_URL, data);

export const updateProcessRequest = (data: ProcessItemType) => http.put(API.PROCESS_URL, data);

export const deleteProcessRequest = (data: DeleteRequest) => http.delete(`${API.PROCESS_URL}?id=${data.id}`);

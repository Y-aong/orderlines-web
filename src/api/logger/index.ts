import http from "@/api";
import { Logger } from "./type";
import { DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  API_LOGGER_URL = "/logger/api",
  API_LOGGER_DETAIL_URL = "/logger/api/detail"
}

export const getApiLoggerDetailRequest = (id: number) =>
  http.get<Logger.ApiLoggerItem>(`${API.API_LOGGER_DETAIL_URL}?id=${id}`);

export const getApiLoggerRequest = (data: Logger.ApiLoggerFilter) =>
  http.get<Logger.ApiLoggerItem[]>(API.API_LOGGER_URL, data);

export const deleteApiLoggerRequest = (id: number) => http.delete<DeleteData>(`${API.API_LOGGER_URL}?id=${id}`);

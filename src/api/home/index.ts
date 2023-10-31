import http from "@/api";

//项目用户相关的请求地址
enum API {
  RUN_NUMBER = "/run_number",
  RUN_STATUS = "/run_status"
}

export const getRunNumber = () => http.get(API.RUN_NUMBER);
export const getRunStatus = () => http.get(API.RUN_STATUS);

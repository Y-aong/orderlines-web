import http from "@/api";
//项目用户相关的请求地址
enum API {
  START_PROCESS = "/orderlines/start",
  STOP_PROCESS = "/orderlines/stop",
  PAUSED_PROCESS = "/orderlines/paused",
  RECOVER_PROCESS = "/orderlines/recover"
}

// 启动流程
export const startProcessRequest = (process_id: string | number) => {
  if (typeof process_id === "string") {
    return http.post(API.START_PROCESS, { process_id: process_id });
  } else {
    return http.post(API.START_PROCESS, { id: process_id });
  }
};

// 停止流程
export const stopProcessRequest = (process_instance_id: string) =>
  http.post(API.STOP_PROCESS, { process_instance_id: process_instance_id });

// 暂停流程
export const pausedProcessRequest = (process_instance_id: string) =>
  http.post(API.PAUSED_PROCESS, { process_instance_id: process_instance_id });

// 恢复流程
export const recoverProcessRequest = (process_instance_id: string) =>
  http.post(API.RECOVER_PROCESS, { process_instance_id: process_instance_id });

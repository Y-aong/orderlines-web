import http from "@/api";
import { OrderlinesOperator } from "./type";
enum API {
  START_PROCESS_URL = "/orderlines/start",
  STOP_PROCESS_URL = "/orderlines/stop",
  PAUSED_PROCESS_URL = "/orderlines/paused",
  RECOVER_PROCESS_URL = "/orderlines/recover",
  STEP_DEBUG_URL = "/orderlines/step_debug"
}

// 启动流程
export const startProcessRequest = (process_id: string | number) => {
  if (typeof process_id === "string") {
    return http.post<OrderlinesOperator.startResponse>(API.START_PROCESS_URL, { process_id: process_id });
  } else {
    return http.post<OrderlinesOperator.startResponse>(API.START_PROCESS_URL, { id: process_id });
  }
};

// 停止流程
export const stopProcessRequest = (process_instance_id: string) =>
  http.post<OrderlinesOperator.StopResponse>(API.STOP_PROCESS_URL, { process_instance_id: process_instance_id });

// 暂停流程
export const pausedProcessRequest = (process_instance_id: string) =>
  http.post<null>(API.PAUSED_PROCESS_URL, { process_instance_id: process_instance_id });

// 恢复流程
export const recoverProcessRequest = (process_instance_id: string) =>
  http.post<null>(API.RECOVER_PROCESS_URL, { process_instance_id: process_instance_id });

// 流程逐步debug
export const stepDebugRequest = (process_id: string, task_id: string) =>
  http.post<null>(API.STEP_DEBUG_URL, { process_id, task_id });

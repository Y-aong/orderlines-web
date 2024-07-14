import http from "@/api";

enum API {
  PROCESS_CONTROL = "/flow/process_control",
  PREV_NODE_RESULT = "/flow/prev_node_result"
}

// 获取流程控制的后续节点
export const getProcessControlRequest = (task_id: string, process_id: string) =>
  http.post(`${API.PROCESS_CONTROL}?task_id=${task_id}&process_id=${process_id}`);

// 获取前一个流程节点的结果
export const getPrevNodeResultRequest = (task_id: string, process_id: string) =>
  http.get(`${API.PREV_NODE_RESULT}?task_id=${task_id}&process_id=${process_id}`);

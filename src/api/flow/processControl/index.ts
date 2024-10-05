import http from "@/api";
import { ProcessControl } from "./type";

enum API {
  PROCESS_CONTROL = "/flow/process_control/next_node",
  PREV_NODE_RESULT = "/flow/prev_node_result"
}

// 获取流程控制的后续节点
export const getPCNextNodeRequest = (task_id: string, process_id: string) =>
  http.get<ProcessControl.NextNode>(`${API.PROCESS_CONTROL}?task_id=${task_id}&process_id=${process_id}`);

// 获取前一个流程节点的结果
export const getPrevNodeResultRequest = (task_id: string, process_id: string) =>
  http.get<ProcessControl.PrevNodeResult>(`${API.PREV_NODE_RESULT}?task_id=${task_id}&process_id=${process_id}`);

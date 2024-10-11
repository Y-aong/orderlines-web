import http from "@/api";
import { FlowData, FlowNode, FlowGraphData } from "./type";

enum API {
  PLUGIN_NODE = "/flow/node_menu",
  TASK_NODE = "/flow/task_node",
  GRAPH_NODE_CONFIG = "/flow/graph_node_data",
  GRAPH_DATA = "/flow/graph_data",
  GRAPH_INSTANCE = "/flow/graph_instance",
  FLOW_SAVE = "/orderlines/save",
  PROCESS_VERSION = "/flow/process_version",
  PROCESS_PARAM_URL = "/flow/process_param",
  SUB_PROCESS_PARAM_URL = "/flow/sub_process/param",
  TASK_BREAKPOINT_URL = "/flow/task/breakpoint"
}

// 获取节点参数
export const getTaskNodeRequest = (taskNode: FlowData.TaskNodeParam) =>
  http.get<FlowData.TaskNode>(API.TASK_NODE, taskNode);

// 获取流程图信息
export const getGraphDataRequest = (graph_data: FlowData.FlowDataFilter) =>
  http.get<FlowGraphData.GraphData>(API.GRAPH_DATA, graph_data);

// 获取流程图实例信息
export const getGraphInstanceRequest = (graph_data: FlowData.FlowInstanceFilter) =>
  http.get<FlowGraphData.GraphData>(API.GRAPH_INSTANCE, graph_data);

// 创建/修改流程图信息
export const createGraphDataRequest = (graph_data: FlowGraphData.FlowGraph) =>
  http.post<string>(API.GRAPH_DATA, graph_data);

// 获取流程图任务节点
export const getGraphNodeDataRequest = (process_id: string, task_id: string) =>
  http.get<FlowNode.GraphNode>(`${API.GRAPH_NODE_CONFIG}?process_id=${process_id}&task_id=${task_id}`);

// 创建/修改流程图任务节点
export const createGraphNodeRequest = (graph_node_data: FlowNode.GraphNode) =>
  http.post<string>(API.GRAPH_NODE_CONFIG, graph_node_data);

// 保存流程
export const saveFlowRequest = (data: any) => http.post<string>(API.FLOW_SAVE, data);

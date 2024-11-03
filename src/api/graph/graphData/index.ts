import http from "@/api";
import { GraphData, GraphNode, FlowGraphData } from "./type";

enum API {
  TASK_NODE = "/graph/task_node",
  GRAPH_NODE_CONFIG = "/graph/graph_node_data",
  GRAPH_DATA = "/graph/graph_data",
  GRAPH_INSTANCE = "/graph/graph_instance",
  FLOW_SAVE = "/orderlines/save",
  PROCESS_VERSION = "/graph/process_version",
  SUB_PROCESS_PARAM_URL = "/graph/sub_process/param",
  TASK_BREAKPOINT_URL = "/graph/task/breakpoint",
  NODE_MENU_URL = "/graph/node_menu"
}

// 获取节点菜单
export const getNodeMenuRequest = () => http.get<GraphData.NodeMenuType[]>(`${API.NODE_MENU_URL}`);

// 获取节点参数
export const getTaskNodeRequest = (taskNode: GraphData.TaskNodeParam) =>
  http.get<GraphData.TaskNode>(API.TASK_NODE, taskNode);

// 获取流程图信息
export const getGraphDataRequest = (graph_data: GraphData.FlowDataFilter) =>
  http.get<FlowGraphData.GraphData>(API.GRAPH_DATA, graph_data);

// 获取流程图实例信息
export const getGraphInstanceRequest = (graph_data: GraphData.FlowInstanceFilter) =>
  http.get<FlowGraphData.GraphData>(API.GRAPH_INSTANCE, graph_data);

// 创建/修改流程图信息
export const createGraphDataRequest = (graph_data: FlowGraphData.FlowGraph) =>
  http.post<string>(API.GRAPH_DATA, graph_data);

// 获取流程图任务节点
export const getGraphNodeDataRequest = (process_id: string, task_id: string) =>
  http.get<GraphNode.GraphNode>(`${API.GRAPH_NODE_CONFIG}?process_id=${process_id}&task_id=${task_id}`);

// 创建/修改流程图任务节点
export const createGraphNodeRequest = (graph_node_data: GraphNode.GraphNode) =>
  http.post<string>(API.GRAPH_NODE_CONFIG, graph_node_data);

// 保存流程
export const saveFlowRequest = (data: GraphData.ProcessSave) => http.post<string>(API.FLOW_SAVE, data);

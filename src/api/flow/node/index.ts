import http from "@/api";

//项目用户相关的请求地址
enum API {
  PLUGIN_NODE = "/node_menu",
  TASK_NODE = "/task_node"
}

// 获取节点菜单
export const getNodeMenuRequest = () => http.get(`${API.PLUGIN_NODE}`);
// 获取节点参数
export const getTaskNodeRequest = (pluginNode: any) => http.get(API.TASK_NODE, { params: pluginNode });

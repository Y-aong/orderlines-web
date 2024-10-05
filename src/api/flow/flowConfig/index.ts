import http from "@/api";
import { FlowConfig } from "@/api/flow/flowConfig/type";
enum API {
  NODE_MENU = "/flow/node_menu"
}

// 获取节点菜单
export const getNodeMenuRequest = () => http.get<FlowConfig.NodeMenuType[]>(`${API.NODE_MENU}`);

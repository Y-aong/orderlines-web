import { GraphData, DefaultTaskConfig, NodeResultItem } from "@/api/graph/graphData/type";

export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

export type AssemblySizeType = "large" | "default" | "small";

export type LanguageType = "zh" | "en" | null;

/* GlobalState */
export interface GlobalState {
  layout: LayoutType;
  assemblySize: AssemblySizeType;
  language: LanguageType;
  maximize: boolean;
  primary: string;
  isDark: boolean;
  isGrey: boolean;
  isWeak: boolean;
  asideInverted: boolean;
  headerInverted: boolean;
  isCollapse: boolean;
  accordion: boolean;
  breadcrumb: boolean;
  breadcrumbIcon: boolean;
  tabs: boolean;
  tabsIcon: boolean;
  footer: boolean;
  refreshMessage: boolean;
}

/* UserState */
export interface UserState {
  token: string;
  userInfo: {
    login_type: string;
    login_value: string;
  };
}

/* tabsMenuProps */
export interface TabsMenuProps {
  icon: string;
  title: string;
  path: string;
  name: string;
  close: boolean;
  isKeepAlive: boolean;
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[];
}

/* AuthState */
export interface AuthState {
  routeName: string;
  authButtonList: {
    [key: string]: string[];
  };
  authMenuList: Menu.MenuOptions[];
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}

export interface FlowStoreType {
  process_type: string;
  process_name: string;
  process_id: string;
  process_version: string;
  namespace: string;
  process_instance_id: string;
  nodeMenu: GraphData.NodeMenuType[];
  nodeConfig: GraphData.NodeConfig;
  nodeParam: any;
  nodeResult: NodeResultItem[];
  defaultTaskConfig: DefaultTaskConfig[];
}

export interface TaskGroupItem {
  task_name: string;
  task_id: string;
}

export interface TaskGroupStore {
  taskGroup: TaskGroupItem[];
}

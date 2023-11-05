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
}

/* UserState */
export interface UserState {
  token: string;
  userInfo: { name: string };
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
export interface Node {
  background: string;
  class_name: string;
  method_name: string;
  task_type?: any;
  text: string;
  type: string;
  version: string;
}

export interface NodeMenuType {
  nodes: Node[];
  nodesType: string;
  title: string;
}

export interface CommonParamType {
  default?: any;
  desc: string;
  name: string;
  required: boolean;
  title: string;
  type: string;
  value: string;
}

export interface nodeConfigType {
  task_name: string;
  desc: string;
  version: string;
  task_id: string;
  method_name: string;
  task_type: string;
  id: number;
}

export interface nodeResultType {
  default?: any;
  desc: string;
  name: string;
  required?: boolean;
  result_key: string;
  title: string;
  type: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DefaultTaskConfigType {
  config_name: string;
  config_value: string | SelectOption[];
  desc: string;
}

export interface ConditionItem {
  condition: string;
  task_status: string;
}

export interface Condition {
  condition: ConditionItem[];
  task_id: string;
}

export interface ProcessControlStatus {
  conditions: Condition[];
  pc_type: string;
}

export interface runningTask {
  task_name: string;
  method_kwargs: any;
  task_config: any;
  task_status: string;
  start_time: string;
  end_time: string;
  task_result: any;
  task_error_info: any;
}

export interface FlowStoreType {
  process_name: string;
  process_id: string;
  process_version: string;
  process_instance_id: string;
  isRunning: boolean;
  isSave: boolean;
  isRedirect: boolean;
  nodeMenu: NodeMenuType[];
  nodeConfig: nodeConfigType;
  // nodeParam: CommonParamType[] | ProcessControlStatus;
  nodeParam: any;
  nodeResult: nodeResultType[];
  defaultTaskConfig: DefaultTaskConfigType[];
  processControlOptions: any;
  runningTask: runningTask[];
  taskProgress: number;
  clickCheckTask: runningTask;
}

export interface TaskGroupItem {
  task_name: string;
  task_id: string;
}

export interface TaskGroupStore {
  taskGroup: TaskGroupItem[];
}

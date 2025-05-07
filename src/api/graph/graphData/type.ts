// 任务默认配置
export interface DefaultTaskConfig {
  config_name: string;
  config_value: string;
  desc: string;
}

// 任务返回值配置
export interface NodeResult {
  return_value: NodeResultItem[];
}
// 任务返回值Item配置
export interface NodeResultItem {
  default?: any;
  desc: string;
  name: string;
  required: boolean;
  title: string;
  type: string;
}

export namespace GraphData {
  // 流程图左侧菜单
  export interface NodeMenuType {
    nodes: any;
    nodesType: string;
    title: string;
    icon: string;
    class_name: string;
    method_name: string;
    version: string;
    type: string;
    text: string;
    options: string[];
  }
  // 流程图保存
  export interface ProcessSave {
    process_id: string;
    process_type: string;
  }

  // 流程图查询条件
  export interface FlowDataFilter {
    process_id: string;
  }
  export interface FlowInstanceFilter {
    process_instance_id: string;
  }
  // 根据任务信息查询任务
  export interface TaskNodeParam {
    method_name: string;
    class_name: string;
    version: string;
  }
  // 流程图中展示的任务节点信息
  export interface TaskNode {
    defaultTaskConfig: DefaultTaskConfig[];
    nodeConfig: NodeConfig;
    nodeParam: NodeParam;
    nodeResult: NodeResult;
  }

  // 任务名称，方法，版本，描述配置
  export interface NodeConfig {
    desc: string;
    task_id: string;
    task_module: string;
    task_type: string;
    id?: number;
    method_name: string;
    task_name: string;
    version: string;
    options: string[];
  }
  // 任务参数配置
  export interface NodeParam {
    parameters: Parameter[] | null;
  }
  // 任务参数item
  export interface Parameter {
    default?: any;
    desc: string;
    name: string;
    required: boolean;
    title: string;
    type: string;
  }
}

export namespace GraphNode {
  export interface GraphNode {
    process_id: string;
    task_id: string;
    nodeResult?: NodeResultItem[];
    defaultTaskConfig?: DefaultTaskConfig[];
    nodeParam?: ProcessControlParam;
  }

  interface ProcessControlParam {
    pc_type: string;
    conditions: Condition[];
  }

  interface Condition {
    task_id: string;
    condition: ConditionItem[];
  }

  interface ConditionItem {
    task_status: string;
    condition: string;
  }
}

export namespace FlowGraphData {
  export interface FlowGraph {
    process_id: string;
    graphData: GraphData;
  }

  export interface GraphData {
    nodes: Node[];
    edges: Edge[];
  }

  interface Edge {
    id: string;
    type: string;
    sourceNodeId: string;
    targetNodeId: string;
    startPoint: StartPoint;
    endPoint: StartPoint;
    properties: Properties2;
    pointsList: StartPoint[];
  }

  interface Properties2 {}

  interface StartPoint {
    x: number;
    y: number;
  }

  export interface Node {
    id: string;
    type: string;
    x: number;
    y: number;
    properties: Properties;
    text: Text;
  }

  interface Text {
    x: number;
    y: number;
    value: string;
  }

  interface Properties {
    method_name: string;
    class_name: string;
    version: string;
    ui?: string;
  }
}

export namespace TaskTable {
  export interface MenuTaskType {
    desc: string;
    text: string;
    type: string;
    method_name: string;
    version: string;
    task_name: string;
    id: number;
    class_name: string;
    options: string[];
  }

  export interface TaskType {
    task_name: string;
    process_id: string;
    method_name: string;
    module_version: string;
    task_index_id: number;
    task_module: string;
    task_id: string;
    task_type: string;
    method_kwargs: any;
    desc: string;
    id: number;
    breakpoint: boolean;
  }
  export interface TaskInstanceType {
    task_name: string;
    process_id: string;
    method_name: string;
    start_time: string;
    end_time: string;
    task_status: string;
    module_version: string;
    task_index_id: number;
    task_module: string;
    task_id: string;
    task_type: string;
    method_kwargs: any;
    desc: string;
    id: number;
  }
}

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

export namespace FlowData {
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

export namespace FlowNode {
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

import { BaseResponse } from "@/api/responseType";

export interface VariableItemType {
  id?: number | string;
  process_id?: string;
  process_name?: string;
  variable_key?: string;
  variable_value?: string;
  variable_desc?: string;
  variable_type?: string;
  is_cache?: boolean;
}

export type ItemsType = VariableItemType[];

export interface VariableResponseType extends BaseResponse {
  data: VariableItemType;
}

// 任务节点
export interface TaskNodeType {
  id?: number;
  task_id?: string;
  process_id: string;
  prev_id?: string;
  next_id?: string;
  task_name?: string;
  method_name?: string;
  method_kwargs?: any;
  creator?: any;
  updater?: string;
  task_type?: string;
  task_module?: string;
  task_config?: any;
  result_config?: any;
  desc?: string;
  module_version?: string;
}

// 获取任务参数
export interface TaskNodeRequestType {
  method_name?: string;
  class_name?: string;
  version?: string;
}

export interface TaskNodeDetailResponseType extends BaseResponse {
  data: TaskNodeType;
}

// 节点菜单
export interface Node {
  background: string;
  class_name: string;
  method_name: string;
  task_type?: any;
  text: string;
  type: string;
  version: string;
}

export interface NodeMenu {
  nodes: Node[];
  nodesType: string;
  title: string;
}

// 节点参数
export namespace TaskNodeNS {
  export interface DefaultTaskConfig {
    config_name: string;
    config_value: string;
    desc: string;
  }

  export interface NodeConfig {
    desc: string;
    method_name: string;
    task_name: string;
    version: string;
  }

  export interface Parameter {
    default?: any;
    desc: string;
    name: string;
    required: boolean;
    title: string;
    type: string;
  }

  export interface NodeParam {
    parameters: Parameter[];
  }

  export interface Return_value {
    default?: any;
    desc: string;
    name: string;
    required: boolean;
    title: string;
    type: string;
  }

  export interface NodeResult {
    return_value: Return_value[];
  }

  export interface TaskNode {
    defaultTaskConfig: DefaultTaskConfig[];
    nodeConfig: NodeConfig;
    nodeParam: NodeParam;
    nodeResult: NodeResult;
  }
}

// flow 变量相关
export namespace FlowVariable {
  export interface VariableItem {
    active: number;
    creator_id?: any;
    creator_name?: any;
    id: number;
    insert_time?: any;
    is_cache?: any;
    process_id: string;
    process_name: string;
    update_time?: any;
    updater_id?: any;
    updater_name?: any;
    variable_desc: string;
    variable_key: string;
    variable_type: string;
    variable_value: string;
  }

  export interface VariableOption {
    label: string;
    value: string;
  }
}

// flow流程图数据
export namespace FlowDataNS {
  export interface EndPoint {
    x: number;
    y: number;
  }

  export interface PointsList {
    x: number;
    y: number;
  }

  export interface Property {}

  export interface Point {
    x: number;
    y: number;
  }

  export interface Edge {
    endPoint: Point;
    id: string;
    pointsList: PointsList[];
    properties: Property;
    sourceNodeId: string;
    startPoint: Point;
    targetNodeId: string;
    type: string;
  }

  export interface Property {
    class_name: string;
    method_name: string;
    version: string;
  }

  export interface Text {
    value: string;
    x: number;
    y: number;
  }

  export interface Node {
    id: string;
    properties: Property;
    text: Text;
    type: string;
    x: number;
    y: number;
  }

  export interface GraphData {
    edges: Edge[];
    nodes: Node[];
  }

  export interface FlowData {
    graphData: GraphData;
    process_id: string;
  }
}

// 流程图中任务配置
export namespace FlowTaskConfigNS {
  export interface DefaultTaskConfig {
    config_name: string;
    config_value: string;
    desc: string;
  }

  export interface NodeResult {
    default: string;
    desc: string;
    name: string;
    required: boolean;
    title: string;
    type: string;
  }

  export interface FlowTaskConfig {
    defaultTaskConfig: DefaultTaskConfig[];
    nodeParam: any[];
    nodeResult: NodeResult[];
    process_id: string;
    task_id: string;
  }
}

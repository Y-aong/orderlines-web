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

  export interface TaskNodeParam {
    method_name: string;
    class_name: string;
    version: string;
  }
}

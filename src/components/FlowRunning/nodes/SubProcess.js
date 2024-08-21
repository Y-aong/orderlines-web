import BaseNode from "./BaseNode.js";

class FunctionNode extends BaseNode.view {}

class SubProcessNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.defaultFill = "rgb(255, 255, 255)";
  }
}

export default {
  type: "sub-process-node",
  model: SubProcessNodeModel,
  view: FunctionNode
};

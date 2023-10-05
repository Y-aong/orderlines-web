import BaseNode from "./BaseNode.js";

class FunctionNode extends BaseNode.view {}

class FunctionNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.defaultFill = "rgb(255, 255, 255)";
  }
}

export default {
  type: "function-node",
  model: FunctionNodeModel,
  view: FunctionNode
};

import BaseNode from "./BaseNode.js";

class DelayNode extends BaseNode.view {}

class DelayNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.defaultFill = "rgb(255, 255, 255)";
  }
}

export default {
  type: "delay-node",
  model: DelayNodeModel,
  view: DelayNode
};

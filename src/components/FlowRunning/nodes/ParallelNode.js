import BaseNode from "./BaseNode.js";

class ParallelNode extends BaseNode.view {}

class ParallelNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.defaultFill = "rgb(255, 255, 255)";
    this.width = 30;
    this.height = 120;
    this.radius = 5;
  }
}

export default {
  type: "parallel-node",
  model: ParallelNodeModel,
  view: ParallelNode
};

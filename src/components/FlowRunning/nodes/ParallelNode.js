import BaseNode from "./BaseNode.js";

class ParallelNode extends BaseNode.view {}

class ParallelNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.defaultFill = "rgb(255, 255, 255)";
    this.width = 80;
    this.height = 35;
    this.radius = 5;
  }
}

export default {
  type: "parallel-node",
  model: ParallelNodeModel,
  view: ParallelNode
};

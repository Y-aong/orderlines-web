import BaseNode from "./BaseNode.js";

class ParallelNode extends BaseNode.view {}

class ParallelNodeModel extends BaseNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = "rgb(254, 227, 226)";
    return style;
  }
}

export default {
  type: "parallel-node",
  model: ParallelNodeModel,
  view: ParallelNode
};

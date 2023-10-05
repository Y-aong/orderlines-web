import { CircleNode, CircleNodeModel } from "@logicflow/core";

class StartNode extends CircleNode {
  initNodeData(data) {
    super.initNodeData(data);
  }
}

class StartNodeModel extends CircleNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.r = 36;
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = "rgb(232, 224, 252)";
    return style;
  }
}

export default {
  type: "start-node",
  model: StartNodeModel,
  view: StartNode
};

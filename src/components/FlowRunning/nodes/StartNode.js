import { CircleNode, CircleNodeModel } from "@logicflow/core";

const StatusColor = {
  SUCCESS: "#2bae85",
  FAILURE: "#de3f7c",
  SKIP: "#ec7696",
  STOP: "#d2d97a",
  RETRY: "#fba414",
  PENDING: "#fbf2e3",
  RUNNING: "#29b7cb"
};

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
  // 重写节点样式
  getNodeStyle() {
    const style = super.getNodeStyle();
    const properties = this.properties;
    if (properties.status === "SUCCESS") {
      style.fill = StatusColor.SUCCESS;
    } else if (properties.status === "FAILURE") {
      style.fill = StatusColor.FAILURE;
    } else if (properties.status === "SKIP") {
      style.fill = StatusColor.SKIP;
    } else if (properties.status === "STOP") {
      style.fill = StatusColor.STOP;
    } else if (properties.status === "RETRY") {
      style.fill = StatusColor.RETRY;
    } else if (properties.status === "PENDING") {
      style.fill = StatusColor.PENDING;
    } else if (properties.status === "RUNNING") {
      style.fill = StatusColor.RUNNING;
    }
    return style;
  }
}

export default {
  type: "start-node",
  model: StartNodeModel,
  view: StartNode
};

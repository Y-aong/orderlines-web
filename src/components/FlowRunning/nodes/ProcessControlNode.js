import { h } from "@logicflow/core";
import { DiamondNode, DiamondNodeModel } from "@logicflow/core";

const StatusColor = {
  SUCCESS: "#2bae85",
  FAILURE: "#de3f7c",
  SKIP: "#ec7696",
  STOP: "#d2d97a",
  RETRY: "#fba414",
  PENDING: "#fbf2e3",
  RUNNING: "#29b7cb"
};

class processControlModel extends DiamondNodeModel {
  //初始化
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 70;
    this.ry = 45;
    this.text.x = this.x;
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

  getData() {
    const data = super.getData();
    data.properties.ui = "orderlines-node";
    return data;
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "transparent";
    style.hover.stroke = "transparent";
    return style;
  }
}

class processControlNode extends DiamondNode {
  // 重写锚点新增
  getAnchorShape(anchorData) {
    const { x, y } = anchorData;
    return h("rect", {
      x: x - 5,
      y: y - 5,
      width: 10,
      height: 10,
      className: "custom-anchor"
    });
  }
}

export default {
  type: "process-control-node",
  model: processControlModel,
  view: processControlNode
};

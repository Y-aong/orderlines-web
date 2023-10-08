import { h } from "@logicflow/core";
import { DiamondNode, DiamondNodeModel } from "@logicflow/core";

class processControlModel extends DiamondNodeModel {
  //初始化
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 70;
    this.ry = 45;
    this.text.x = this.x;
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
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = "rgb(225, 215, 185)";
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

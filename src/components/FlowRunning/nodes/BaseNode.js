import { RectNode, RectNodeModel, h } from "@logicflow/core";
const StatusColor = {
  SUCCESS: "#2bae85",
  FAILURE: "#de3f7c",
  SKIP: "#ec7696",
  STOP: "#d2d97a",
  RETRY: "#fba414",
  PENDING: "#fbf2e3",
  RUNNING: "#29b7cb"
};

const getBytesLength = word => {
  if (!word) {
    return 0;
  }
  let totalLength = 0;
  for (let i = 0; i < word.length; i++) {
    const c = word.charCodeAt(i);
    if (word.match(/[A-Z]/)) {
      totalLength += 1.5;
    } else if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      totalLength += 1;
    } else {
      totalLength += 1.8;
    }
  }
  return totalLength;
};

class RedNodeModel extends RectNodeModel {
  /**
   * 初始化
   */
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 220;
    this.height = 60;
    this.radius = 8;
    this.text.x = this.x;
  }

  getData() {
    const data = super.getData();
    data.properties.ui = "orderlines-node";
    return data;
  }

  // 动态设置初始化数据
  setAttributes() {
    if (this.text.value) {
      let width = 30 + getBytesLength(this.text.value) * 9;
      width = Math.ceil(width / 20) * 20;
      if (width < 100) {
        width = 100;
      }
      this.width = width;
    }
  }

  updateText(val) {
    super.updateText(val);
    this.setAttributes();
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

  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "transparent";
    style.hover.stroke = "transparent";
    return style;
  }
}

class RedNode extends RectNode {
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
  type: "red-node",
  model: RedNodeModel,
  view: RedNode
};

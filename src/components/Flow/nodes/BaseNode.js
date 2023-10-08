import { RectNode, RectNodeModel, h } from "@logicflow/core";

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
    style.fill = "#f0f4fc";
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

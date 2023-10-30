import { GroupNode } from "@logicflow/extension";

class GroupNodeView extends GroupNode.view {}

class GroupNodeModel extends GroupNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.text.draggable = true;
    this.text.editable = true;
    this.isRestrict = true;
    this.resizable = true;
    this.isFolded = true;
    this.width = 320;
    this.height = 200;
    this.radius = 10;
    this.foldedWidth = 100;
    this.foldedHeight = 0;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = "rgb(199, 218, 205)";
    return style;
  }

  // 设置拖动节点到分组上时，分组高亮的提示效果样式。
  getAddableOutlineStyle() {
    const style = super.getAddableOutlineStyle();
    style.stroke = "#AEAFAE";
    style.strokeDasharray = "1 1";
    return style;
  }

  //限制流程控制被添加到此分组中
  isAllowAppendIn(nodeData) {
    return nodeData.type !== "process-control_node";
  }

  updateText(val) {
    super.updateText(val);
    this.setAttributes();
  }

  // 设置文字类型
  getTextStyle() {
    const style = super.getTextStyle();
    style.editable = true;
    return style;
  }
}

export default {
  type: "group-node",
  model: GroupNodeModel,
  view: GroupNodeView
};

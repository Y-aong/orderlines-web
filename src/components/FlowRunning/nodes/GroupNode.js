import { GroupNode } from "@logicflow/extension";

const StatusColor = {
  SUCCESS: "#55bb8a",
  FAILURE: "#de3f7c",
  SKIP: "#ec7696",
  STOP: "#d2d97a",
  RETRY: "#fba414",
  PENDING: "#fbf2e3",
  RUNNING: "#29b7cb"
};

class GroupNodeView extends GroupNode.view {}

class GroupNodeModel extends GroupNode.model {
  initNodeData(data) {
    let nodeWidth = data.properties.nodeSize ? data.properties.nodeSize.height - 12 : 88;
    if (!data.text || typeof data.text === "string") {
      data.text = {
        value: data.text || "",
        x: data.x,
        y: data.y - nodeWidth
      };
    }
    super.initNodeData(data);
    this.text.draggable = true;
    this.text.editable = true;
    this.isRestrict = true;
    this.resizable = true;
    this.width = 180;
    this.height = 120;
    this.radius = 5;
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

import BaseNode from "./BaseNode.js";

class FunctionNode extends BaseNode.view {}

class SubProcessNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = "rgb(102, 175, 239)";
    return style;
  }
}

export default {
  type: "sub-process-node",
  model: SubProcessNodeModel,
  view: FunctionNode
};

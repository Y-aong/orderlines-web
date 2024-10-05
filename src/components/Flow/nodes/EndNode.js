import { CircleNode, CircleNodeModel } from "@logicflow/core";

class EndNode extends CircleNode {}

class EndNodeModel extends CircleNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.r = 28;

    const endNodeRule = {
      message: "结束节点后续没有节点",
      validate: targetNode => {
        return !targetNode.type;
      }
    };

    this.sourceRules.push(endNodeRule);
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = "rgb(232, 224, 252)";
    return style;
  }
}

export default {
  type: "end-node",
  model: EndNodeModel,
  view: EndNode
};

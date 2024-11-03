import { CircleNode, CircleNodeModel } from "@logicflow/core";

class StartNode extends CircleNode {
  initNodeData(data) {
    super.initNodeData(data);
  }
}

class StartNodeModel extends CircleNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.r = 28;

    // 开始节点校验规则
    const startNodeRule1 = {
      message: "开始节点前续没有节点",
      validate: sourceNode => {
        return !sourceNode.type;
      }
    };
    const edgeOutRule = {
      message: "开始节点为起点的连线只能有一条",
      validate: sourceNode => {
        return sourceNode.outgoing.edges.length === 0;
      }
    };

    this.targetRules.push(startNodeRule1);
    this.sourceRules.push(edgeOutRule);
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

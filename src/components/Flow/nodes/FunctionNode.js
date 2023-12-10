import BaseNode from "./BaseNode.js";

class FunctionNode extends BaseNode.view {}

class FunctionNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.defaultFill = "rgb(255, 255, 255)";

    const edgeOutRule = {
      message: "任务节点为起点的连线只能有一条",
      validate: sourceNode => {
        return sourceNode.outgoing.edges.length === 0;
      }
    };
    const edgeInRule = {
      message: "任务节点为终点的连线只能有一条",
      validate: (sourceNode, targetNode) => {
        return targetNode.incoming.edges.length === 0;
      }
    };

    this.sourceRules.push(edgeOutRule);
    this.targetRules.push(edgeInRule);
  }
}

export default {
  type: "function-node",
  model: FunctionNodeModel,
  view: FunctionNode
};

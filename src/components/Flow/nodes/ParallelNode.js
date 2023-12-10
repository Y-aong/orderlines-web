import BaseNode from "./BaseNode.js";

class ParallelNode extends BaseNode.view {}

class ParallelNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);

    const edgeInRule = {
      message: "并行任务节点为终点的连线只能有一条",
      validate: (sourceNode, targetNode) => {
        return targetNode.incoming.edges.length === 0;
      }
    };

    this.targetRules.push(edgeInRule);
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = "rgb(254, 227, 226)";
    return style;
  }
}

export default {
  type: "parallel-node",
  model: ParallelNodeModel,
  view: ParallelNode
};

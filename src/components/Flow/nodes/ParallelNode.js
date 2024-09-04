import BaseNode from "./BaseNode.js";

class ParallelNode extends BaseNode.view {}

class ParallelNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 30;
    this.height = 120;
    this.radius = 5;
    // const edgeOutRule = {
    //   message: "并行网关为起点的连线只能有一条",
    //   validate: sourceNode => {
    //     return sourceNode.outgoing.edges.length === 0;
    //   }
    // };

    // this.sourceRules.push(edgeOutRule);
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

import BaseNode from "./BaseNode.js";

class ParallelNode extends BaseNode.view {}

class ParallelNodeModel extends BaseNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.defaultFill = "rgb(255, 255, 255)";
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
}

export default {
  type: "parallel-node",
  model: ParallelNodeModel,
  view: ParallelNode
};

import { h } from "@logicflow/core";
import { DiamondNode, DiamondNodeModel } from "@logicflow/core";

class processControlModel extends DiamondNodeModel {
  //初始化
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 70;
    this.ry = 45;
    this.text.x = this.x;

    // 设置节点的校验规则
    const processControlRule1 = {
      message: "流程控制节点下个节点只能为普通节点或流程控制节点",
      validate: (sourceNode, targetNode) => {
        return (
          (sourceNode.type === "function-node" || sourceNode.type === "process-control-node") &&
          targetNode.type !== "start-node"
        );
      }
    };

    const processControlRule2 = {
      message: "流程控制节点上个节点不能为开始节点",
      validate: targetNode => {
        return targetNode.type !== "start-node";
      }
    };
    const processControlRule3 = {
      message: "流程控制节点上个节点不能为结束节点",
      validate: targetNode => {
        return targetNode.type !== "end-node";
      }
    };

    const processControlRule4 = {
      message: "流程控制节点上个节点不能为任务组节点",
      validate: targetNode => {
        return targetNode.type !== "group-node";
      }
    };
    const processControlRule5 = {
      message: "流程控制节点上个节点不能为并行节点",
      validate: targetNode => {
        return targetNode.type !== "parallel-node";
      }
    };
    const edgeInRule = {
      message: "流程控制节点为终点的连线只能有一条",
      validate: (sourceNode, targetNode) => {
        return targetNode.incoming.edges.length === 0;
      }
    };

    this.targetRules.push(edgeInRule);
    this.sourceRules.push(processControlRule1);
    this.targetRules.push(processControlRule2);
    this.targetRules.push(processControlRule3);
    this.targetRules.push(processControlRule4);
    this.targetRules.push(processControlRule5);
  }

  getData() {
    const data = super.getData();
    data.properties.ui = "orderlines-node";
    return data;
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "transparent";
    style.hover.stroke = "transparent";
    return style;
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = "rgb(225, 215, 185)";
    return style;
  }
}

class processControlNode extends DiamondNode {
  // 重写锚点新增
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
  type: "process-control-node",
  model: processControlModel,
  view: processControlNode
};

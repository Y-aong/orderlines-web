import { CurvedEdge, CurvedEdgeModel } from "@logicflow/extension";

class CustomCurvedEdge extends CurvedEdge {}

class CustomCurvedEdgeModel extends CurvedEdgeModel {
  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    style.strokeDasharray = "8 5";
    style.animationDuration = "15s";
    style.stroke = "rgb(61, 152, 247)";
    style.strokeWidth = 2;
    return style;
  }

  initEdgeData(data) {
    super.initEdgeData(data);
    this.radius = 5;
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeWidth = 2;
    style.stroke = "rgb(0,0,0)";
    return style;
  }
}

export default {
  type: "flow-link",
  view: CustomCurvedEdge,
  model: CustomCurvedEdgeModel
};

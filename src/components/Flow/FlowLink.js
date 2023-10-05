import { CurvedEdge, CurvedEdgeModel } from "@logicflow/extension";

class CustomCurvedEdge extends CurvedEdge {}

class CustomCurvedEdgeModel extends CurvedEdgeModel {
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

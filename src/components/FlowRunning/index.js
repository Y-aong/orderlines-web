import { createApp } from "vue";
import ElementPlus from "element-plus";
import JsonViewer from "vue3-json-viewer";
import StartNode from "./nodes/StartNode.js";
import EndNode from "./nodes/EndNode.js";
import DelayNode from "./nodes/DelayNode.js";
import FunctionNode from "./nodes/FunctionNode.js";
import ProcessControlNode from "./nodes/ProcessControlNode.js";
import ParallelNode from "./nodes/ParallelNode.js";
import GroupNode from "./nodes/GroupNode.js";
import SelectNode from "./nodes/SelectNode.js";
import FlowLink from "./FlowLink.js";
import Palette from "./palette/index.vue";
import VueHtmlNode from "./nodes/VueHtmlNode.js";
import pinia from "../../stores";

class OrderlinesNodeExtension {
  static pluginName = "OrderlinesNodeExtension";

  constructor({ lf }) {
    // 基础节点
    lf.register(StartNode);
    lf.register(EndNode);
    lf.register(DelayNode);
    lf.register(SelectNode);
    // 普通任务节点
    lf.register(FunctionNode);
    // 任务网关
    lf.register(ProcessControlNode);
    lf.register(ParallelNode);
    lf.register(GroupNode);

    lf.register(FlowLink);
    lf.register(VueHtmlNode);
    lf.setDefaultEdgeType("flow-link");
    this.app = createApp(Palette, { lf });
  }

  render(lf, domOverlay) {
    const node = document.createElement("div");
    node.className = "task-node";
    domOverlay.appendChild(node);
    this.app.use(pinia);
    this.app.use(ElementPlus);
    this.app.use(JsonViewer);
    this.app.mount(node);
  }
}

export default OrderlinesNodeExtension;

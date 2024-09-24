import { RectNode, RectNodeModel, h } from "@logicflow/core";
const StatusColor = {
  SUCCESS: "#2bae85",
  FAILURE: "#de3f7c",
  SKIP: "#ec7696",
  STOP: "#d2d97a",
  RETRY: "#fba414",
  PENDING: "#fbf2e3",
  RUNNING: "#29b7cb"
};

const getBytesLength = word => {
  if (!word) {
    return 0;
  }
  let totalLength = 0;
  for (let i = 0; i < word.length; i++) {
    const c = word.charCodeAt(i);
    if (word.match(/[A-Z]/)) {
      totalLength += 1.5;
    } else if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      totalLength += 1;
    } else {
      totalLength += 1.8;
    }
  }
  return totalLength;
};

class RedNodeModel extends RectNodeModel {
  /**
   * 初始化
   */
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 220;
    this.height = 60;
    this.radius = 8;
    this.text.x = this.x;
  }

  getData() {
    const data = super.getData();
    data.properties.ui = "orderlines-node";
    return data;
  }

  // 动态设置初始化数据
  setAttributes() {
    if (this.text.value) {
      let width = 30 + getBytesLength(this.text.value) * 9;
      width = Math.ceil(width / 20) * 20;
      if (width < 100) {
        width = 100;
      }
      this.width = width;
    }
  }

  updateText(val) {
    super.updateText(val);
    this.setAttributes();
  }

  // 重写节点样式
  getNodeStyle() {
    const style = super.getNodeStyle();
    const properties = this.properties;
    if (properties.breakpoint) {
      style.fill = "#f1939c";
    }
    if (properties.status === "SUCCESS") {
      style.fill = StatusColor.SUCCESS;
    } else if (properties.status === "FAILURE") {
      style.fill = StatusColor.FAILURE;
    } else if (properties.status === "SKIP") {
      style.fill = StatusColor.SKIP;
    } else if (properties.status === "STOP") {
      style.fill = StatusColor.STOP;
    } else if (properties.status === "RETRY") {
      style.fill = StatusColor.RETRY;
    } else if (properties.status === "PENDING") {
      style.fill = StatusColor.PENDING;
    } else if (properties.status === "RUNNING") {
      style.fill = StatusColor.RUNNING;
    }
    return style;
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "transparent";
    style.hover.stroke = "transparent";
    return style;
  }
}

class RedNode extends RectNode {
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
  getShape() {
    // 通过 getAttributes 获取 model 中的属性
    const { x, y, width, height, radius } = this.props.model;
    const style = this.props.model.getNodeStyle();
    const properties = this.props.model.properties;
    if (properties.breakpoint) {
      // getShape 的返回值是一个通过 h 方法创建的 svg 元素
      return h("g", {}, [
        h("rect", { ...style, x: x - width / 2, y: y - height / 2, width, height, rx: radius, ry: radius }),
        h(
          "svg",
          {
            x: x - width / 2 + 5,
            y: y - height / 2 + 5,
            width: 25,
            height: 25,
            viewBox: "0 0 1274 1024"
          },
          h("path", {
            d: "M960.299 553.421c0 9.717-3.547 18.123-10.645 25.222-7.1 7.1-15.504 10.651-25.216 10.651h-125.523c0 63.889-12.511 118.055-37.546 162.509l116.557 117.126c7.099 7.089 10.651 15.5 10.651 25.216 0 9.713-3.547 18.119-10.651 25.217-6.727 7.089-15.126 10.641-25.216 10.641-10.086 0-18.492-3.551-25.216-10.641l-110.957-110.397c-1.867 1.862-4.666 4.293-8.402 7.281-3.743 2.987-11.584 8.318-23.542 15.971-11.952 7.659-24.096 14.478-36.422 20.457-12.331 5.975-27.653 11.396-45.958 16.253-18.305 4.85-36.428 7.282-54.353 7.282v-502.099h-71.729v502.099c-19.045 0-38.013-2.526-56.872-7.572-18.873-5.041-35.121-11.205-48.758-18.491-13.639-7.286-25.965-14.565-36.982-21.856-11.023-7.287-19.144-13.353-24.381-18.206l-8.402-7.851-102.55 116.002c-7.472 7.84-16.435 11.766-26.9 11.766-8.965 0-16.994-2.993-24.090-8.966-7.101-6.726-10.931-15.038-11.497-24.937-0.556-9.9 2.338-18.584 8.695-26.057l113.192-127.202c-21.665-42.596-32.502-93.778-32.502-153.554h-125.522c-9.719 0-18.12-3.551-25.216-10.645-7.101-7.103-10.653-15.504-10.653-25.222 0-9.712 3.551-18.123 10.653-25.215 7.096-7.095 15.498-10.642 25.216-10.642h125.521v-164.747l-96.945-96.945c-7.097-7.1-10.647-15.504-10.647-25.217 0-9.712 3.554-18.123 10.647-25.216 7.095-7.099 15.503-10.655 25.217-10.655 9.718 0 18.116 3.562 25.218 10.655l96.945 96.945h472.964l96.946-96.945c7.094-7.099 15.498-10.655 25.216-10.655 9.713 0 18.121 3.562 25.215 10.655 7.1 7.094 10.652 15.504 10.652 25.216 0 9.713-3.551 18.119-10.652 25.217l-96.945 96.945v164.75h125.522c9.717 0 18.122 3.547 25.216 10.647 7.099 7.093 10.651 15.503 10.651 25.209v0l-0.005-0.001zM691.316 230.65h-358.641c0-49.681 17.466-91.993 52.398-126.926 34.923-34.933 77.241-52.393 126.923-52.393 49.684 0 92.002 17.459 126.925 52.393 34.934 34.932 52.393 77.245 52.393 126.926v0 0 0z",
            stroke: "#f1939c"
          })
        )
      ]);
    } else {
      return super.getShape();
    }
  }
}

export default {
  type: "red-node",
  model: RedNodeModel,
  view: RedNode
};

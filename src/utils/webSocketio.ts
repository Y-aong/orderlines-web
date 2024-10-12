import { io, Socket } from "socket.io-client";
import useRunningTaskStore from "@/stores/modules/runningTask";
import useFlowStore from "@/stores/modules/flow";
import useDebugStore from "@/stores/modules/debug";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";

let { process_instance_id } = storeToRefs(useFlowStore());
let { running_edge, taskProgress, graph_data } = storeToRefs(useRunningTaskStore());
let { debugMessage } = storeToRefs(useDebugStore());

export function UseSocketIo() {
  let socketIo: Socket;
  const init = (namespace: string) => {
    socketIo = io(`http://127.0.0.1:15900/${namespace}`, { path: "/socket.io" });

    // 监听连接事件
    socketIo.on("connect", () => {
      console.log(`websocket:: connected to ${namespace} namespace`);
    });

    // 监听关闭事件
    socketIo.on("disconnect", () => {
      console.log(`websocket:: disconnected to namespace ${namespace} `);
    });

    // 监听接受信息
    socketIo.on(namespace, data => {
      try {
        const topic = data.topic;
        const message = data.message;
        const receive_process_instance_id = data.process_instance_id;
        if (topic === "running_logger" && receive_process_instance_id === process_instance_id.value) {
          running_edge.value = message.running_edge;
          taskProgress.value = message.task_progress;
          graph_data.value = message.graph_data.graphData;
        } else if (topic === "debug_message" && message) {
          if (!debugMessage.value.find(item => deepEqual(item, message))) {
            const sign = message.sign;
            if (sign) ElMessage.success(sign);
            debugMessage.value.push(message);
          }
        }
      } catch (error) {
        console.error("websocket:: 异常信息", data);
        console.error("websocket:: 处理消息时出错:", error);
      }
    });
  };
  const deepEqual = (a: any, b: any) => {
    if (a === b) return true;
    if (a == null || typeof a != "object" || b == null || typeof b != "object") return false;
    let keysA = Object.keys(a),
      keysB = Object.keys(b);
    if (keysA.length != keysB.length) return false;
    for (let key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  };
  // 发送消息
  const send = (namespace: string, data: any) => {
    socketIo.emit(namespace, data);
    console.log(`websocket:: namespace ${namespace}发送消息:`, data);
  };

  // socket io关闭
  const close = (namespace: string) => {
    if (socketIo) {
      socketIo.close();
      console.log(`websocket:: 关闭namespace ${namespace} `);
    }
  };

  return { init, send, close };
}

import { io, Socket } from "socket.io-client";
import useRunningTaskStore from "@/stores/modules/runningTask";
import { storeToRefs } from "pinia";

let { running_edge, taskProgress, graph_data } = storeToRefs(useRunningTaskStore());

export function UseSocketIo(namespace: string) {
  let socketIo: Socket;
  const init = () => {
    socketIo = io(`http://127.0.0.1:15900/${namespace}`, { path: "/socket.io" });

    // 监听连接事件
    socketIo.on("connect", () => {
      console.log(`connected to ${namespace} namespace`);
    });

    // 监听关闭事件
    socketIo.on("disconnect", () => {
      console.log(`disconnected to namespace ${namespace} `);
    });

    // 监听接受信息
    socketIo.on(namespace, message => {
      try {
        if (namespace === "running_logger") {
          running_edge.value = message.running_edge;
          taskProgress.value = message.task_progress;
          graph_data.value = message.graph_data.graphData;
        }
      } catch (error) {
        console.error("异常信息", message);
        console.error("处理消息时出错:", error);
      }
    });
  };

  // 发送消息
  const send = (data: any) => {
    socketIo.emit(namespace, data);
    console.log(`namespace ${namespace}发送消息, ${data}`);
  };

  // socket io关闭
  const close = () => {
    if (socketIo) {
      socketIo.close();
    }
  };

  return { init, send, close };
}

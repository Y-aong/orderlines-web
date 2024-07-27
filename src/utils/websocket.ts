import useRunningTaskStore from "@/stores/modules/runningTask";
import { storeToRefs } from "pinia";

let { running_edge, taskProgress, graph_data } = storeToRefs(useRunningTaskStore());

export function useWebSocket(
  url: string,
  topic: string
): { init: () => void; send: (data: any) => void; close: () => void } {
  // 尝试重新连接次数
  let reconnectAttempts = 0;
  // 重连间隔时间
  const MAX_RECONNECT_ATTEMPTS = 5;
  let socket: WebSocket;

  const init = () => {
    socket = new WebSocket(url);

    // 监听连接事件
    socket.addEventListener("open", () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log(`topic：${topic}连接成功`);
        socket.send(JSON.stringify({ action: "subscribe", topic: topic }));
      }
    });

    // 监听接受信息
    socket.addEventListener("message", (event: MessageEvent) => {
      try {
        console.log(event.data);
        const data = JSON.parse(event.data);
        if (topic === "running_logger") {
          running_edge.value = data.msg.running_edge;
          taskProgress.value = data.msg.task_progress;
          graph_data.value = data.msg.graph_data.graphData;
        }
      } catch (error) {
        console.error("处理消息时出错:", error);
      }
    });

    // 监听关闭事件
    socket.addEventListener("close", () => {
      console.log("closed");
    });

    // 监听错误事件
    socket.addEventListener("error", () => {
      console.error("WebSocket错误");
      reconnectAttempts++;
      if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
        setTimeout(init, 2000); // 2秒后尝试重连
      } else {
        console.error("重连尝试次数过多，放弃重连");
      }
    });
  };

  const send = (data: any) => {
    console.log(`topic：${topic}发送消息, ${data}`);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  };

  const close = () => {
    if (socket) {
      socket.close();
    }
  };
  return { init, send, close };
}

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
        socket.send(JSON.stringify({ action: "subscribe", topic: topic }));
      }
    });

    // 监听接受信息
    socket.addEventListener("message", (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("消息处理完成", data);
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

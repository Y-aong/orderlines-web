import WebSocket from "ws";

// 创建了一个客户端的socket,然后让这个客户端去连接服务器的socket
let sock = new WebSocket("ws://127.0.0.1:8765");
sock.on("open", function () {
  console.log("connect success !!!!");
  sock.send("HelloWorld1");
  sock.send("HelloWorld2");
  sock.send("HelloWorld3");
  sock.send("HelloWorld4");
});

sock.on("error", function (err) {
  console.log("error: ", err);
});

sock.on("close", function () {
  console.log("close");
});

sock.on("message", function (data) {
  console.log("data==", data);
});

<template>
  <div class="card content-box">
    <span class="text"> 系统日志（待完善） 🍓🍇🍈🍉</span>
  </div>
</template>

<script setup lang="ts" name="systemLog">
import { useWebSocket } from "@/utils/websocket";
import { onMounted, onUnmounted } from "vue";

const { init, close, send } = useWebSocket("ws://127.0.0.1:18765", "process_id123");

onMounted(() => {
  init();
});

onUnmounted(() => {
  close();
  // 取消订阅主题
  send(JSON.stringify({ action: "unsubscribe", topic: "process_id123", message: "ok" }));
});
</script>

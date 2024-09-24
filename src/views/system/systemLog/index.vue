<template>
  <div class="card content-box">
    <span class="text"> 系统日志（待完善） 🍓🍇🍈🍉</span>
  </div>
</template>

<script setup lang="ts" name="systemLog">
import { UseSocketIo } from "@/utils/webSocketio";

import { onMounted, onUnmounted } from "vue";

const { init, close, send } = UseSocketIo();

onMounted(() => {
  init("running_logger");
});

onUnmounted(() => {
  close("running_logger");
  // 取消订阅主题
  send("running_logger", JSON.stringify({ action: "unsubscribe", topic: "running_logger", message: "ok" }));
});
</script>

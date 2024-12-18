<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="total" class="item">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`告警(${total})`" name="first">
          <div class="message-list">
            <div v-for="item in activeMessage" :key="item.id" class="message-item">
              <img src="@/assets/images/msg01.png" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title" @click="goToDetail(item.id)">{{ item.process_name }}</span>
                <span class="message-date">{{ item.insert_time }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="消息(0)" name="second">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="代办(0)" name="third">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无代办</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getAlarmMessageRequest } from "@/api/alarm/process/index";
import { useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/modules/global";
import { storeToRefs } from "pinia";

let { refreshMessage } = storeToRefs(useGlobalStore());

const router = useRouter();

const activeName = ref("first");
const activeMessage = ref<any>([]);
const total = ref<number>(0);
onMounted(async () => {
  await getAlarmMessage();
});
const getAlarmMessage = async () => {
  const res: any = await getAlarmMessageRequest();
  if (res.code === 200) {
    activeMessage.value = res.data.alarm_message;
    total.value = res.data.total;
  }
};

const goToDetail = async (detailId: string) => {
  router.push({ path: `/alarm/detail/${detailId}` });
};

watch(refreshMessage, async (value: boolean) => {
  if (value) {
    await getAlarmMessage();
    refreshMessage.value = false;
  }
});
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 40px;
}
.message-list {
  display: flex;
  flex-direction: column;
  height: 500px;
  overflow-y: auto;
  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border: none;
    }
    .message-icon {
      width: 30px;
      height: 30px;
      margin: 0 20px 0 5px;
    }
    .message-content {
      display: flex;
      flex-direction: column;
      .message-title {
        margin-bottom: 5px;
      }
      .message-date {
        font-size: 10px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>

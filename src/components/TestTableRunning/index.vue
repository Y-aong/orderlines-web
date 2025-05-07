<template>
  <div class="flex">
    <el-menu class="el-menu" mode="vertical">
      <template v-for="node in nodeMenu" :key="node.title">
        <el-sub-menu v-if="node.title" :index="node.title">
          <template #title>
            <el-icon> <component :is="node.icon"></component> </el-icon>
            <span>{{ node.title }}</span>
          </template>
          <!-- common -->
          <template v-if="!node.nodes[0].nodes">
            <VueDraggable
              v-model="node.nodes"
              :animation="150"
              ghost-class="ghost"
              :group="{ name: 'people', pull: 'clone', put: false }"
              :sort="false"
              :scroll="true"
              :disabled="true"
            >
              <div v-for="(item, index) in node.nodes" :key="index">
                <el-menu-item :index="item.text" v-if="!node.nodes[0].nodes">
                  <el-button class="title" plain>{{ item.text }}</el-button>
                </el-menu-item>
              </div>
            </VueDraggable>
          </template>
          <!-- category -->
          <template v-if="node.nodes[0].nodes">
            <template v-for="item in node.nodes" :key="item.title">
              <el-sub-menu :index="item.title">
                <template #title>{{ item.title }}</template>
                <VueDraggable
                  v-model="item.nodes"
                  :animation="150"
                  ghost-class="ghost"
                  :group="{ name: 'people', pull: 'clone', put: false }"
                  :sort="false"
                  :scroll="true"
                  :disabled="true"
                >
                  <div v-for="temp in item.nodes" :key="temp.text">
                    <el-menu-item :index="temp.text">
                      <el-button class="title" plain>{{ temp.text }}</el-button>
                    </el-menu-item>
                  </div>
                </VueDraggable>
              </el-sub-menu>
            </template>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>

    <VueDraggable
      v-model="taskNodes"
      :animation="150"
      group="people"
      ghost-class="ghost"
      class="test_edit"
      :disabled="true"
    >
      <div v-for="item in taskNodes" :key="item.id" class="test_edit_item" @click="checkTaskInstance(item.task_id)">
        <!-- 左侧内容区域（名称 + 描述） -->
        <div class="left-content">
          <span class="task_name">
            <el-tag :type="taskStatusTag[item.task_status]">{{ item.task_name }}-节点</el-tag>
          </span>
          <span class="task_description">
            函数参数：{{ item.method_kwargs }}、开始时间：{{ item.start_time }}、开始时间：{{ item.end_time }}
          </span>
        </div>

        <!-- 操作列 -->
        <div class="actions">
          <el-button :icon="taskStatus[item.task_status]" circle size="small" :type="taskStatusTag[item.task_status]" />
        </div>
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { VueDraggable } from "vue-draggable-plus";
import useGraphStore from "@/stores/modules/graph";
import { Loading, CircleCheck, CircleClose, Lock, AlarmClock, Warning } from "@element-plus/icons-vue";
import { TaskTable } from "@/api/graph/graphData/type";
import useRunningTaskStore from "@/stores/modules/runningTask";
import { getAllTaskInstanceRequest } from "@/api/orderlines/orderlinesManager/taskInstance/index";
import { getTaskInstanceItem } from "@/api/orderlines/orderlinesManager/taskInstance/index";

let { process_id, process_instance_id, nodeMenu } = storeToRefs(useGraphStore());
let { getNodeMenu } = useGraphStore();
let { clickCheckTask } = storeToRefs(useRunningTaskStore());

const taskStatus = {
  RUNNING: Loading,
  SUCCESS: CircleCheck,
  FAILURE: CircleClose,
  PENDING: Loading,
  STOP: Lock,
  TIMEOUT: AlarmClock,
  PAUSED: Warning
};
const taskStatusTag = {
  RUNNING: "primary",
  SUCCESS: "success",
  FAILURE: "danger",
  PENDING: "info",
  STOP: "warning",
  TIMEOUT: "warning",
  PAUSED: "warning"
};

const taskNodes = ref<TaskTable.TaskInstanceType[]>([]);

onMounted(async () => {
  let nodeMenuData = await getNodeMenu();
  nodeMenu.value = nodeMenuData;
  setInterval(async () => {
    const response: any = await getAllTaskInstanceRequest(process_id.value, process_instance_id.value);
    taskNodes.value = response.data;
  }, 3000);
});

const checkTaskInstance = async (taskId: string) => {
  const response = await getTaskInstanceItem(process_instance_id.value, taskId);
  if (response.code == 200) {
    clickCheckTask.value = {
      ...response.data,
      task_result: response.data.task_result ?? null
    };
  }
};
</script>

<style scoped lang="scss">
.el-menu {
  width: 210px;
  max-height: 300px !important;
  font-size: 12;
  border-right: none;
  .el-menu-item {
    width: 100%;
    height: 60%;
    margin: 8px auto;
    font-size: 10px;
    .title {
      width: 100px;
      height: 24px;
      font-size: 12px;
      border-radius: 5px;
    }
  }
}
.test_edit {
  position: fixed;
  top: 60px;
  left: 210px;
  width: calc(100% - 210px - 25%);
  height: 75%;
  overflow-y: auto;
  border: 1px solid #ebe6e6;
  .test_edit_item {
    display: flex;
    align-items: center; /* 垂直居中 */
    padding: 10px 15px;
    border-bottom: 1px solid #eeeeee;
    .left-content {
      display: flex;
      flex: 1; /* 占据剩余空间 */
      flex-direction: column; /* 名称和描述垂直排列 */
      margin-right: 20px; /* 与操作列间距 */
      .task_name {
        font-size: 13px;
        font-weight: bold;
      }
      .task_description {
        max-width: 900px; /* 限制描述长度 */
        overflow: hidden;
        font-size: 12px;
        color: #666666;
        text-indent: 2em;
        text-overflow: ellipsis;
        white-space: nowrap; /* 防止换行（可选） */
      }
    }
    .actions {
      display: flex;
      align-items: center;
    }
  }
}
:deep(.el-sub-menu__title) {
  height: 48px !important;
}
</style>

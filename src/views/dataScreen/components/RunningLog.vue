<template>
  <div class="log-card">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div>
            流程名称: &nbsp; <span class="process-name">{{ runningInfo.process_info.name }}</span> &nbsp;
          </div>
          <div>
            <el-tag round effect="dark">{{ runningInfo.process_info.status }}</el-tag>
          </div>
        </div>
        <el-progress
          :percentage="data.process_info.progress"
          :stroke-width="30"
          striped
          :text-inside="true"
          striped-flow
          status="success"
          :duration="8"
          style="width: 100%"
        />
      </template>
      <div class="card-context">
        <el-card class="task" style="">
          <div>任务名称: {{ runningInfo.running_task.task_name }}</div>
          <div>
            任务状态: <el-tag round effect="dark" type="success">{{ runningInfo.running_task.task_status }}</el-tag>
          </div>
          <div>
            {{ JSON.stringify(runningInfo.running_task.task_result) !== "{}" ? "任务结果" : "任务异常" }}:
            <el-button
              v-if="JSON.stringify(runningInfo.running_task.task_result) !== '{}'"
              size="small"
              type="primary"
              @click="resultVisible = true"
            >
              任务结果
            </el-button>
            <el-button
              v-if="JSON.stringify(runningInfo.running_task.task_error) !== '{}'"
              size="small"
              type="primary"
              @click="resultVisible = true"
            >
              任务异常
            </el-button>
          </div>
          <div>开始时间: {{ runningInfo.running_task.start_time }}</div>
          <div>结束时间: {{ runningInfo.running_task.end_time }}</div>
        </el-card>
        <div class="timeline-box">
          <el-timeline class="timeline">
            <el-timeline-item
              v-for="(activity, index) in runningInfo.task_nodes"
              size="large"
              :key="index"
              :icon="activity.icon"
              :color="activity.color"
              :timestamp="activity.start_time"
            >
              {{ activity.task_name }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-card>
    <el-dialog v-model="resultVisible" title="任务结果" width="30%">
      <json-viewer :value="runningInfo.running_task.task_result" copyable boxed sort expanded />
    </el-dialog>
    <el-dialog v-model="errorVisible" title="任务异常" width="30%">
      <json-viewer :value="runningInfo.running_task.task_error" copyable boxed sort expanded />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="RunningLog">
import { ref, defineProps, watch } from "vue";
import { RunningInfoType } from "@/api/dataScreen/type";

let resultVisible = ref<boolean>(false);
let errorVisible = ref<boolean>(false);

interface Props {
  data: RunningInfoType;
}
const props = defineProps<Props>();
let runningInfo = ref<RunningInfoType>({
  process_info: {
    name: "",
    process_instance_id: "",
    progress: 0,
    status: ""
  },
  running_task: {
    end_time: "",
    start_time: "",
    task_error: {},
    task_name: "",
    task_result: {
      status: ""
    },
    task_status: ""
  },
  task_nodes: [
    {
      color: "",
      icon: "",
      start_time: "",
      task_name: ""
    }
  ]
});
watch(props, () => {
  runningInfo.value = props.data;
});
</script>

<style scoped>
.log-card {
  align-content: center;
  height: 600px;
  padding-top: 0;
  margin: 0;
  list-style: none;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  font-size: 20px;
  font-weight: bold;
}
.card-context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  line-height: 32px;
}
.box-card {
  width: 100%;
  height: 100%;
  color: white;
  background-color: rgb(25 24 42 / 83.4%);
  border: 2px solid rgb(16 80 116);
  border-radius: 10px;
  box-shadow: 0 0 12px rgb(11 183 218) inset;
}
.process-name {
  color: #66ffff;
}
.timeline-box {
  width: 240px;
  height: 100%;
  overflow: auto;
}
.timeline {
  height: 400px;
}
::v-deep .el-timeline-item__content {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}
::v-deep .el-timeline-item__timestamp {
  font-size: 14px;
  color: #ffffff;
}
.timeline-box::-webkit-scrollbar {
  display: none;
}
.task {
  width: 500px;
  padding-left: 20px;
  color: #ffffff;
  background-color: rgb(25 24 42 / 83.4%);
  border: 0 solid rgb(16 80 116);
  border-radius: 10px;
}
.select {
  border: 0 solid rgb(16 80 116);
}
</style>

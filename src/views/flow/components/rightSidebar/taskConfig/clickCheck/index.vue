<template>
  <div>
    <h3>任务运行日志</h3>
    <div class="task-progress">
      <el-progress
        :percentage="taskProgress < 100 ? taskProgress : 100"
        :stroke-width="20"
        striped
        :text-inside="true"
        striped-flow
        status="success"
        :duration="8"
        style="width: 90%"
      />
    </div>
    <el-collapse-item title="查看运行结果" name="clickCheck">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>
              任务名称: <el-tag>{{ clickCheckTask.task_name }}</el-tag>
              &nbsp;
              <el-tag type="success">{{ clickCheckTask.task_status }}</el-tag>
            </span>

            <div>
              <el-button
                v-if="clickCheckTask.task_result"
                size="small"
                icon="View"
                type="primary"
                circle
                @click="check('查看任务结果', clickCheckTask.task_result)"
              />

              <el-button
                v-if="clickCheckTask.task_error_info"
                size="small"
                icon="BellFilled"
                type="warning"
                circle
                @click="check('查看任务异常', clickCheckTask.task_error_info)"
              />
            </div>
          </div>
        </template>
        <div class="card-context">
          <div>
            <el-button size="small" type="primary" round @click="check('查看任务参数', clickCheckTask.method_kwargs)">
              查看参数
            </el-button>
            <el-button size="small" type="danger" round @click="check('查看任务配置', clickCheckTask.task_config)">
              查看配置
            </el-button>
          </div>
          <div>开始时间：{{ clickCheckTask.start_time }}</div>
          <div>结束时间：{{ clickCheckTask.end_time }}</div>
        </div>
      </el-card>
    </el-collapse-item>
    <el-collapse-item title="运行报告下载" name="runningLog">
      <el-card class="box-card">
        <el-button type="primary" :icon="Download" @click="downloadFile" :disabled="taskProgress !== 100" plain>
          下载报告
        </el-button>
      </el-card>
    </el-collapse-item>
    <el-dialog :title="title" width="80%" v-model="dialogVisible">
      <json-viewer :value="taskResultError" copyable boxed sort expanded :expand-depth="depth" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="clickCheck">
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import useRunningTaskStore from "@/stores/modules/runningTask";
import "vue3-json-viewer/dist/index.css";
import { Download } from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
import { processHtmlExport } from "@/api/orderlines/orderlinesManager/process/index";

const { process_instance_id, process_name } = storeToRefs(useFlowStore());
const { clickCheckTask, taskProgress } = storeToRefs(useRunningTaskStore());
const depth = ref<number>(5);
const dialogVisible = ref<boolean>(false);
let title = ref<string>("查看任务结果");
let taskResultError = reactive({});

const check = (type: string, row: any) => {
  try {
    title.value = type;
    dialogVisible.value = true;
    if (typeof row === "string") {
      row = JSON.parse(row);
    }
    taskResultError = row;
  } catch (e) {
    console.error(`${row}数据解析失败, ${e}`);
    taskResultError = row;
  }
};

// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认下载流程运行报告?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(
      processHtmlExport,
      `${process_name.value}——运行报告`,
      { process_instance_id: process_instance_id.value },
      true,
      ".html"
    );
  });
};
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: bold;
}
.card-context {
  font-size: 14px;
  line-height: 32px;
}
.box-card {
  width: 100%;
  height: 90%;
}
</style>

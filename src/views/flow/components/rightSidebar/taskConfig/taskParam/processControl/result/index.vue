<template>
  <el-tab-pane label="任务返回" name="result">
    <template v-if="nodeParam.pc_type === 'result'">
      <p>流程控制——任务返回值</p>

      <el-table :data="nodeParam.conditions" style="width: 100%" title>
        <el-table-column label="任务分支" min-width="90">
          <template #default="scope">
            <el-select v-model="scope.row.task_id" placeholder="请选择任务分支" disabled>
              <el-option
                v-for="item in processControlOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="任务条件" min-width="90">
          <template #default="scope">
            <span v-html="scope.row.expression ? scope.row.expression : ''" />
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="button">
      <el-button style="width: 50%" type="primary" @click="getTaskIdOption">编辑</el-button>
      <el-button style="width: 50%" type="success" @click="checkParam">查看</el-button>
    </div>
  </el-tab-pane>

  <el-dialog v-model="updateResult" :show-close="false">
    <template #header="{ titleId, titleClass }">
      <div class="dialog_header">
        <h4 :id="titleId" :class="titleClass">查看流程控制参数——任务运行状态</h4>
      </div>
    </template>

    <el-table :data="nodeParam.conditions" border style="width: 100%" :default-expand-all="expand">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.condition">
            <el-table-column label="返回值">
              <template #default="scope">
                <el-select
                  v-model="props.row.condition[scope.$index].condition"
                  placeholder="选择返回值"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in prevResultOption"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                    @blur="createExpression(props.$index)"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="比较方式">
              <template #default="scope">
                <el-select
                  v-model="props.row.condition[scope.$index].sign"
                  placeholder="请选择比较方式"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in signs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    @blur="createExpression(props.$index)"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="目标值">
              <template #default="scope">
                <el-input
                  v-model="props.row.condition[scope.$index].target"
                  placeholder="请输入目标值"
                  @blur="createExpression(props.$index)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="条件操作" align="center" min-width="100" width="100" fixed="right">
              <template #default="scope">
                <el-button type="primary" :icon="Plus" size="small" circle @click="addCondition(props.$index)" />
                <el-button
                  type="danger"
                  :icon="Delete"
                  size="small"
                  circle
                  @click="deleteCondition(props.$index, scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="任务分支" min-width="90">
        <template #default="scope">
          <el-select v-model="scope.row.task_id" placeholder="请选择任务分支">
            <el-option
              v-for="item in processControlOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="任务条件" min-width="90">
        <template #default="scope">
          <span v-html="scope.row.expression ? scope.row.expression : ''" />
        </template>
      </el-table-column>
      <el-table-column label="分支操作" align="center" min-width="80" width="80" fixed="right">
        <template #default="props">
          <el-button type="danger" size="small" @click="deleteBranch(props.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button type="primary" size="default" @click="addBranch">增加</el-button>
      <el-button type="primary" size="default" @click="updateProcessControlParam">保存</el-button>
      <el-button type="primary" size="default" @click="updateResult = false">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="visible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog_header">
        <h4 :id="titleId" :class="titleClass">查看流程控制参数——任务返回值</h4>
        <el-button type="danger" @click="close"> Close </el-button>
      </div>
    </template>
    <json-viewer :value="nodeParam" copyable boxed sort expanded :expand-depth="depth" />
  </el-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { ref } from "vue";
import { createTaskFlowDataRequest, getFlowTaskDataRequest } from "@/api/flow/taskNode/index";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { getPrevNodeResultRequest } from "@/api/flow/processControl/index";
import { setStorage } from "@/utils/storage";
import { branchItem, conditionItem, processControlStatusItem, signs } from "@/utils/variable";
import { Delete, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import "vue3-json-viewer/dist/index.css";

let { nodeParam, process_id, nodeConfig, processControlOptions } = storeToRefs(useFlowStore());
let depth = ref(5);
let prevResultOption = ref<any>([]);
let visible = ref(false);
let updateResult = ref(false);
const expand = ref(true);

const checkParam = () => {
  visible.value = true;
};

const getTaskIdOption = async () => {
  let preTaskConfigResponse: any = await getPrevNodeResultRequest(nodeConfig.value.task_id, process_id.value);
  if (preTaskConfigResponse.code === 200) {
    console.log("preTaskConfigResponse.data", preTaskConfigResponse.data);
    prevResultOption.value = preTaskConfigResponse.data.result_config_options;
  }
  updateResult.value = true;
};

const getProcessControlParam = async () => {
  const result: any = await getFlowTaskDataRequest(process_id.value, nodeConfig.value.task_id);
  nodeParam.value = result.data.nodeParam;
  setStorage(processControlStatusItem, "NODE_PARAM");
};

// 修改流程图数据
const updateFlowData = async () => {
  const update_task_param_flow = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    nodeParam: nodeParam.value
  };
  await createTaskFlowDataRequest(update_task_param_flow);
};

interface TaskNodeType {
  id: number;
  process_id: string;
  method_kwargs: any;
}

// 修改流程控制参数
const updateProcessControlParam = async () => {
  let taskNode: TaskNodeType = {
    id: nodeConfig.value.id,
    process_id: process_id.value,
    method_kwargs: nodeParam.value
  };
  await updateTaskRequest(taskNode);
  await updateFlowData();
  await getProcessControlParam();
  ElMessage.success("保存流程控制参数成功");
  updateResult.value = false;
};
// 增加分支
const addBranch = () => {
  let branch_item = JSON.parse(JSON.stringify(branchItem));
  console.log("branch_item", branch_item);
  nodeParam.value.conditions.push(branch_item);
};

// 删除分支
const deleteBranch = (branchIndex: number) => {
  let newBranch = [];
  nodeParam.value.conditions.forEach((item: any, index: number) => {
    if (index !== branchIndex && item) newBranch.push(item);
  });
  if (newBranch.length === 1) {
    newBranch.push(JSON.parse(JSON.stringify(branchItem)));
  }
  nodeParam.value.conditions = newBranch;
};

// 增加条件
const addCondition = (branchIndex: number) => {
  let condition = JSON.parse(JSON.stringify(conditionItem));
  nodeParam.value.conditions[branchIndex].condition.push(condition);
};

const deleteCondition = (branchIndex: number, conditionIndex: number) => {
  let newCondition = [];
  nodeParam.value.conditions[branchIndex].condition.forEach((item: any, index: number) => {
    if (index !== conditionIndex) newCondition.push(item);
  });
  if (newCondition.length === 1) {
    newCondition.push(JSON.parse(JSON.stringify(conditionItem)));
  }
  nodeParam.value.conditions[branchIndex].condition = newCondition;
};

// 创建表达式
const createExpression = (branchIndex: number) => {
  nodeParam.value.conditions[branchIndex].expression = "";
  let conditionStr = "";
  nodeParam.value.conditions[branchIndex].condition.forEach(
    (temp: { condition: string; sign: string; target: any }) => {
      let item = `${temp.condition}${temp.sign}${temp.target}`;
      conditionStr += item ? `${item}<br/>` : "";
    }
  );
  nodeParam.value.conditions[branchIndex].expression = conditionStr;
};
</script>
<script lang="ts">
export default {
  name: "RESULT"
};
</script>

<style scoped>
p {
  padding: 0;
  font-size: 13px;
  font-weight: bold;
}
.button {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.dialog_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

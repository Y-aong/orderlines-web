<template>
  <el-tab-pane label="任务返回" name="result">
    <template v-if="nodeParam.pc_type !== 'status'">
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
            <span v-html="scope.row.expression ? scope.row.expression : ''"></span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="button">
      <el-button style="width: 50%" type="primary" @click="getTaskIdOption">编辑</el-button>
      <el-button style="width: 50%" type="success" @click="checkParam">查看</el-button>
    </div>
  </el-tab-pane>
  <!--修改流程控制节点的result -->
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
                    :label="item.label"
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
      <el-table-column label="分支操作" align="center" min-width="90" width="90" fixed="right">
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
  <!-- 查看流程控制参数 -->
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
import useGraphStore from "@/stores/modules/graph";
import useProcessControlStore from "@/stores/modules/processControl";
import { ref } from "vue";
import { createGraphNodeRequest, getGraphNodeDataRequest } from "@/api/graph/graphData/index";
import { GraphNode } from "@/api/graph/graphData/type";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { getPrevNodeResultOptionRequest } from "@/api/option/index";
import { Option } from "@/api/option/type";
import { setStorage } from "@/utils/storage";
import { branchItem, conditionItem, processControlStatusItem, signs } from "@/utils/variable";
import { Delete, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import "vue3-json-viewer/dist/index.css";
import { BaseResponse } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import useGraphStatueStore from "@/stores/modules/graphStatue";

let { isUpdateParam } = storeToRefs(useGraphStatueStore());
let { userInfo } = storeToRefs(useUserStore());
let { processControlOptions } = storeToRefs(useProcessControlStore());
let { nodeParam, process_id, nodeConfig } = storeToRefs(useGraphStore());
let depth = ref(5);
let prevResultOption = ref<any>([]);
let visible = ref(false);
let updateResult = ref(false);
const { edit_process_action } = useGraphStatueStore();
const expand = ref(true);
const checkParam = () => {
  visible.value = true;
};

const getTaskIdOption = async () => {
  let preTaskConfigResponse: BaseResponse<Option.PrevNodeResult> = await getPrevNodeResultOptionRequest(
    nodeConfig.value.task_id,
    process_id.value
  );
  if (preTaskConfigResponse.code === 200) {
    prevResultOption.value = preTaskConfigResponse.data.result_config_options;
  }
  updateResult.value = true;
};

const getProcessControlParam = async () => {
  const result: any = await getGraphNodeDataRequest(process_id.value, nodeConfig.value.task_id);
  nodeParam.value = result.data.nodeParam;
  setStorage(processControlStatusItem, "NODE_PARAM");
};

// 修改流程图和节点数据
const updateFlowData = async () => {
  const graph_node_data: GraphNode.GraphNode = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    nodeParam: nodeParam.value
  };
  await createGraphNodeRequest(graph_node_data);
};

interface TaskNodeType {
  id?: number;
  process_id: string;
  method_kwargs: any;
  updater_name: any;
}

// 修改流程控制参数
const updateProcessControlParam = async () => {
  console.log(nodeParam.value);
  for (let i = 0; i < nodeParam.value.conditions.length; i++) {
    let conditionTaskId = nodeParam.value.conditions[i].task_id;
    let condition = nodeParam.value.conditions[i].condition;
    if (conditionTaskId === "") {
      ElMessage.error("流程控制分支未设置");
      return;
    }
    condition.forEach((conditionItem: any) => {
      if (conditionItem.condition == "" || conditionItem.sign == "" || conditionItem.target == "") {
        ElMessage.error("流程任务分支未设置");
        return;
      }
    });
  }
  let taskNode: TaskNodeType = {
    id: nodeConfig.value.id,
    process_id: process_id.value,
    method_kwargs: nodeParam.value,
    updater_name: userInfo.value.login_value
  };
  await updateTaskRequest(taskNode);
  await updateFlowData();
  await getProcessControlParam();
  ElMessage.success("保存流程控制参数成功");
  isUpdateParam.value = true;

  await edit_process_action();
  updateResult.value = false;
};
// 增加分支
const addBranch = () => {
  let branch_item = JSON.parse(JSON.stringify(branchItem));
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
    (temp: { condition: string; sign: string; target: string }) => {
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

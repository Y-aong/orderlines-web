<template>
  <div class="graph_tabbar">
    <GraphTabbar />
  </div>

  <div class="container">
    <template v-if="!isRunning">
      <Graph v-if="process_type == 'orderlines'" />
      <TestTable v-if="process_type == 'test'" />
    </template>

    <template v-if="isRunning">
      <GraphRunning v-if="process_type == 'orderlines'" />
      <TestTableRunning v-if="process_type == 'test'" />
    </template>
    <template v-if="isDebug || isRunning">
      <GraphBottom />
    </template>
  </div>
  <div :class="{ running_right: isRunning, config_right: !isRunning }">
    <GraphRightSidebar />
  </div>

  <el-dialog v-model="dialogFormVisible" title="流程配置创建">
    <el-form style="width: 80%" :model="ProcessItem" ref="formRef">
      <el-form-item label="流程名称" prop="process_name" required label-width="120px">
        <el-input placeholder="请输入流程名称" v-model="ProcessItem.process_name"> </el-input>
      </el-form-item>
      <el-form-item label="流程版本" prop="version" required label-width="120px">
        <el-input placeholder="请输入流程版本" v-model="ProcessItem.version"> </el-input>
      </el-form-item>
      <el-form-item label="流程类型" prop="process_type" required label-width="120px">
        <el-select v-model="ProcessItem.process_type" placeholder="请选择流程类型">
          <el-option label="普通流程" value="orderlines"></el-option>
          <el-option label="测试流程" value="test"></el-option>
          <el-option label="流水线流程" value="jenkins"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="命名空间" prop="namespace" required label-width="120px">
        <el-input placeholder="请输入命名空间" v-model="ProcessItem.namespace"> </el-input>
      </el-form-item>
      <el-form-item label="流程描述" prop="desc" label-width="120px">
        <el-input placeholder="请输入流程描述" v-model="ProcessItem.desc"> </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="cancel"> 取消 </el-button>
      <el-button type="primary" size="default" @click="confirm"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="FlowPanel">
import Graph from "@/components/Graph/index.vue";
import TestTable from "@/components/TestTable/index.vue";
import TestTableRunning from "@/components/TestTableRunning/index.vue";
import GraphRunning from "@/components/GraphRunning/index.vue";
import GraphTabbar from "./tabbar/index.vue";
import GraphBottom from "./bottom/index.vue";
import GraphRightSidebar from "./rightSidebar/index.vue";
import { onMounted, reactive, ref } from "vue";
import { v4 as uuid } from "uuid";

import { createProcessRequest } from "@/api/orderlines/orderlinesManager/process/index";
import { ElMessage } from "element-plus";
import useGraphStore from "@/stores/modules/graph";
import useGraphStatueStore from "@/stores/modules/graphStatue";
import { storeToRefs } from "pinia";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";
import { BaseResponse } from "@/api/interface";
import { BaseData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from "vue-router";

const router = useRouter();

let { userInfo } = storeToRefs(useUserStore());
let { process_name, process_type } = storeToRefs(useGraphStore());
let { isRunning, isDebug } = storeToRefs(useGraphStatueStore());
let dialogFormVisible = ref<boolean>(false);
const { process_init_action } = useGraphStatueStore();
const { gotoProcessEdit } = useGraphStore();

onMounted(async () => {
  if (!process_name.value || process_name.value == "null") {
    dialogFormVisible.value = true;
  }
});

let ProcessItem = reactive<Process.ProcessItem>({
  process_id: "",
  process_name: "",
  process_type: "",
  version: "0.0.1",
  creator_name: userInfo.value.login_value,
  desc: "",
  process_config: {
    timeout: 7200,
    notice_type: "FAILURE",
    is_send: true,
    setup: { name: "", method_kwargs: "" },
    teardown: { name: "", method_kwargs: "" }
  },
  process_params: {},
  update_time: "",
  updater_name: "",
  namespace: "default"
});

// 确定
const confirm = async () => {
  const processUUID: any = uuid();
  let requestData: Process.ProcessItem = {
    process_id: processUUID,
    process_name: ProcessItem.process_name,
    process_type: ProcessItem.process_type,
    version: ProcessItem.version,
    namespace: ProcessItem.namespace,
    version_desc: ProcessItem.version_desc,
    process_params: ProcessItem.process_params,
    process_config: ProcessItem.process_config,
    desc: ProcessItem.desc
  };

  let res: BaseResponse<BaseData> = await createProcessRequest(requestData);
  if (res.code == 200) {
    await process_init_action();
    await gotoProcessEdit(processUUID);
    router.push(`/graph/general/index`);
    window.location.reload();
    dialogFormVisible.value = false;
    ElMessage.success("添加流程配置成功");
  } else {
    ElMessage.error(res.message);
  }
};

//对话框底部取消按钮
const cancel = () => {
  //对话框隐藏
  dialogFormVisible.value = false;
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 60px;
  left: 0;
  width: 75%;
  height: 100vh;
}
.graph_tabbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: white;
}
.running_right {
  position: fixed;
  top: 0;
  left: 75%;
  width: 25%;
  height: 80vh;
  background-color: #fdfdfd;
}
.config_right {
  position: fixed;
  top: 0;
  left: 75%;
  width: 25%;
  height: 100vh;
  background-color: #fdfdfd;
}
.running_bottom {
  position: fixed;
  top: 80vh;
  left: 75%;
  width: 25%;
  height: 20vh;
  background-color: #ffffff;
}
.config_bottom {
  position: fixed;
  top: 100vh;
  left: 75%;
  width: 25%;
  height: 0;
  background-color: #ffffff;
}
::v-deep .custom-minimap {
  background: url("data:image/png;base64,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");
  background-size: 100% 100%;
}
</style>

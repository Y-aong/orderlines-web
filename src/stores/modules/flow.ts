import { defineStore } from "pinia";
import { getTaskNodeRequest, getNodeMenuRequest, getFlowTaskDataRequest } from "@/api/flow";
import { getStorage, setStorage } from "@/utils/storage";

const useFlowStore = defineStore("FlowStore", {
  state: () => {
    return {
      // 是否运行
      isRunning: getStorage("IS_RUNNING", "bool"),
      // 是否保存
      isSave: getStorage("IS_SAVE", "bool"),
      //节点菜单
      nodeMenu: getStorage("NODE_MENU", "obj"),
      // 流程名称
      process_name: getStorage("PROCESS_NAME", "str"),
      // 流程id
      process_id: getStorage("PROCESS_ID", "str"),
      // 节点配置
      nodeConfig: getStorage("NODE_CONFIG", "list"),
      // 节点参数
      nodeParam: getStorage("NODE_PARAM", "list"),
      // 节点结果
      nodeResult: getStorage("NODE_RESULT", "list"),
      // 节点任务配置文件
      defaultTaskConfig: getStorage("DEFAULT_TASK_CONFIG", "list"),
      // 流程控制任务id options
      processControlOptions: getStorage("PROCESS_CONTROL_OPTIONS", "list")
    };
  },
  actions: {
    // 获取插件节点信息
    async getNodeMenu() {
      const result: any = await getNodeMenuRequest();
      if (result.code == 200) {
        setStorage(result.data, "NODE_MENU");
        return result.data;
      } else {
        return Promise.reject(new Error(result.data));
      }
    },
    // 获取任务节点数据
    async getTaskNode(process_id: string) {
      console.log("获取任务节点数据");
      let result: any = await getTaskNodeRequest(process_id);
      if (result.code == 200) {
        let data = result.data;
        // 获取任务默认参数
        this.nodeParam = data.nodeParam.parameters;
        setStorage(data.nodeParam.parameters, "NODE_PARAM");
        // 获取任务结果
        this.nodeResult = data.nodeResult.return_value;
        setStorage(data.nodeResult.return_value, "NODE_RESULT");
        // 获取任务默认配置
        this.defaultTaskConfig = data.defaultTaskConfig;
        setStorage(data.defaultTaskConfig, "DEFAULT_TASK_CONFIG");
      } else {
        return Promise.reject(new Error(result.data));
      }
    },
    // 获取流程图数据
    async getFlowTaskData(process_id: string, task_id: string) {
      let result: any = await getFlowTaskDataRequest(process_id, task_id);
      console.log("result", result);

      if (result.code == 200) {
        let data = result.data;
        // 获取任务默认参数
        this.nodeParam = data.nodeParam;
        setStorage(data.nodeParam, "NODE_PARAM");
        // 获取任务结果
        this.nodeResult = data.nodeResult;
        setStorage(data.nodeResult, "NODE_RESULT");
        // 获取任务默认配置
        this.defaultTaskConfig = data.defaultTaskConfig;
        setStorage(data.defaultTaskConfig, "DEFAULT_TASK_CONFIG");
      } else {
        return Promise.reject(new Error(result.data));
      }
    }
  }
});

export default useFlowStore;

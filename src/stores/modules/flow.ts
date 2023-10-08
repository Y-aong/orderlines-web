import { defineStore } from "pinia";
import { getTaskNodeRequest, getNodeMenuRequest, getFlowTaskDataRequest } from "@/api/flow";
import { getStorage } from "@/utils/storage";

const useFlowStore = defineStore("FlowStore", {
  state: () => {
    return {
      // 流程名称
      process_name: getStorage("PROCESS_NAME", "str"),
      // 流程id
      process_id: getStorage("PROCESS_ID", "str"),
      // 是否运行
      isRunning: false,
      // 是否保存
      isSave: false,
      //节点菜单
      nodeMenu: [],

      // 节点配置
      nodeConfig: [],
      // 节点参数
      nodeParam: [],
      // 节点结果
      nodeResult: [],
      // 节点任务配置文件
      defaultTaskConfig: [],
      // 流程控制任务id options
      processControlOptions: []
    };
  },
  actions: {
    // 获取插件节点信息
    async getNodeMenu() {
      const result: any = await getNodeMenuRequest();
      if (result.code == 200) {
        this.nodeMenu = result.data;
        return result.data;
      } else {
        return Promise.reject(new Error(result.data));
      }
    },
    // 获取任务节点数据
    async getTaskNode(process_id: string) {
      let result: any = await getTaskNodeRequest(process_id);
      console.log("获取任务节点数据", result);
      if (result.code == 200) {
        let data = result.data;
        // 获取任务默认参数
        this.nodeParam = data.nodeParam.parameters;
        // 获取任务结果
        this.nodeResult = data.nodeResult.return_value;
        // 获取任务默认配置
        this.defaultTaskConfig = data.defaultTaskConfig;
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
        // 获取任务结果
        this.nodeResult = data.nodeResult;
        // 获取任务默认配置
        this.defaultTaskConfig = data.defaultTaskConfig;
      } else {
        return Promise.reject(new Error(result.data));
      }
    }
  }
});

export default useFlowStore;

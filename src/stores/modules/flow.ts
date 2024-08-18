import { defineStore } from "pinia";
import { getNodeMenuRequest, getTaskNodeRequest, getFlowTaskDataRequest } from "@/api/flow/taskNode/index";

import { getStorage } from "@/utils/storage";
import { FlowStoreType, NodeMenuType } from "../interface/index";
import { TaskNodeNS } from "@/api/flow/taskNode/type";
import { BaseResponse } from "@/api/interface/index";

const useFlowStore = defineStore("FlowStore", {
  state: (): FlowStoreType => {
    return {
      // 流程名称
      process_name: getStorage("PROCESS_NAME", "str") as string,
      // 流程id
      process_id: getStorage("PROCESS_ID", "str") as string,
      // 流程版本
      process_version: getStorage("PROCESS_VERSION", "str") as string,
      // 流程实例id
      process_instance_id: "",
      // 是否运行
      isRunning: false,
      // 是否为跳转的链接
      isRedirect: false,
      // 是否保存
      isSave: false,
      //节点菜单
      nodeMenu: [],
      // 节点配置
      nodeConfig: {
        task_name: "",
        desc: "",
        version: "",
        task_id: "",
        method_name: "",
        task_type: "",
        id: 0
      },
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
    // change running
    changeRunning() {
      this.isRunning = true;
    },
    // 获取插件节点信息
    async getNodeMenu() {
      const result: BaseResponse<NodeMenuType[]> = await getNodeMenuRequest();
      if (result.code == 200) {
        this.nodeMenu = result.data;
        return result.data;
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    // 获取任务节点数据
    async getTaskNode(taskNode: TaskNodeNS.TaskNodeParam) {
      let result: any = await getTaskNodeRequest(taskNode);
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

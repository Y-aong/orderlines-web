import { defineStore } from "pinia";
import { getNodeMenuRequest } from "@/api/flow/flowConfig/index";
import { getTaskNodeRequest, getGraphNodeDataRequest } from "@/api/flow/flowData/index";
import { FlowConfig } from "@/api/flow/flowConfig/type";

import { getStorage } from "@/utils/storage";
import { FlowStoreType } from "../interface/index";
import { BaseResponse } from "@/api/interface/index";
import { FlowData } from "@/api/flow/flowData/type";
export interface taskNodeType {
  method_name: string;
  class_name: string;
  version: string;
}

const useFlowStore = defineStore("FlowStore", {
  state: (): FlowStoreType => {
    return {
      // 流程名称
      process_name: getStorage("PROCESS_NAME", "str") as string,
      // 流程id
      process_id: getStorage("PROCESS_ID", "str") as string,
      // 流程版本
      process_version: getStorage("PROCESS_VERSION", "str") as string,
      // 命名空间，相当于tag
      namespace: getStorage("PROCESS_NAMESPACE", "str") as string,
      // 流程实例id
      process_instance_id: "",
      // 节点菜单
      nodeMenu: [],
      // 节点配置
      nodeConfig: {} as FlowData.NodeConfig,
      // 节点参数
      nodeParam: [],
      // 节点结果
      nodeResult: [],
      // 节点任务配置文件
      defaultTaskConfig: []
    };
  },
  actions: {
    // 获取插件节点信息
    async getNodeMenu() {
      const result: BaseResponse<FlowConfig.NodeMenuType[]> = await getNodeMenuRequest();
      if (result.code == 200) {
        this.nodeMenu = result.data;
        return result.data;
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    // 获取任务节点数据
    async getTaskNode(taskNode: taskNodeType) {
      let response: BaseResponse<FlowData.TaskNode> = await getTaskNodeRequest(taskNode);
      if (response.code == 200) {
        let data = response.data;
        // 获取任务默认参数
        if (data.nodeParam.parameters) {
          this.nodeParam = data.nodeParam.parameters;
        }
        // 获取任务结果
        this.nodeResult = data.nodeResult.return_value;
        // 获取任务默认配置
        this.defaultTaskConfig = data.defaultTaskConfig;
      }
    },
    // 获取流程图数据
    async getGraphNodeData(process_id: string, task_id: string) {
      let result: any = await getGraphNodeDataRequest(process_id, task_id);
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

import { defineStore } from "pinia";
import { getNodeMenuRequest } from "@/api/flow/flowConfig/index";
import { getTaskNodeRequest, getGraphNodeDataRequest } from "@/api/flow/flowData/index";
import { getProcessDetailRequest } from "@/api/orderlines/orderlinesManager/process/index";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";
import { FlowConfig } from "@/api/flow/flowConfig/type";
import { getStorage, setStorage } from "@/utils/storage";
import { FlowStoreType } from "../interface/index";
import { BaseResponse } from "@/api/interface/index";
import { FlowData } from "@/api/flow/flowData/type";
import { ElMessage } from "element-plus";

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
      process_instance_id: getStorage("PROCESS_INSTANCE_ID", "str") as string,
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
    // 获取流程详情
    async getProcessDetail(process_id: string) {
      const response: BaseResponse<Process.ProcessItem> = await getProcessDetailRequest(process_id);
      if (response.code == 200) {
        return response.data;
      } else {
        ElMessage.error("获取流程详情失败");
        throw new Error("获取流程详情失败");
      }
    },
    // 前往流程编辑
    async gotoProcessEdit(process_id: string) {
      this.process_id = process_id;

      const processDetail: Process.ProcessItem = await this.getProcessDetail(process_id);
      if (!processDetail) return;
      // 根据流程id获取流程信息
      this.process_name = processDetail.process_name;
      this.process_version = processDetail.version;
      this.namespace = processDetail.namespace;
      this.process_instance_id = "";
      setStorage(process_id, "PROCESS_ID");
      setStorage(processDetail.process_name, "PROCESS_NAME");
      setStorage(processDetail.version, "PROCESS_VERSION");
      setStorage(processDetail.namespace, "PROCESS_NAMESPACE");
      setStorage("", "PROCESS_INSTANCE_ID");
    },

    // 前往流程运行
    async gotoProcessRunning(process_id: string, process_instance_id: string) {
      const processDetail: Process.ProcessItem = await this.getProcessDetail(process_id);
      if (!processDetail) return;
      this.process_id = process_id;
      this.process_instance_id = process_instance_id;
      this.process_name = processDetail.process_name;
      this.process_version = processDetail.version;
      this.namespace = processDetail.namespace;
      setStorage(processDetail.process_id, "PROCESS_ID");
      setStorage(processDetail.process_name, "PROCESS_NAME");
      setStorage(processDetail.version, "PROCESS_VERSION");
      setStorage(processDetail.namespace, "PROCESS_NAMESPACE");
      setStorage(process_instance_id, "PROCESS_INSTANCE_ID");
    },

    // 设置流程实例ID
    seProcessInstanceID(process_instance_id: string) {
      this.process_instance_id = process_instance_id;
      setStorage(process_instance_id, "PROCESS_INSTANCE_ID");
    },
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

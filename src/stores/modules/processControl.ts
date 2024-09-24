import { defineStore } from "pinia";

export namespace processControl {
  // 流程控制——运行状态
  export interface ProcessStatusType {
    pc_type: string;
    conditions: statusCondition[];
  }

  interface statusCondition {
    task_id: string;
    condition: statusConditionItem[];
  }

  interface statusConditionItem {
    task_status: string;
    condition: string;
  }

  // 流程控制——运行结果
  export interface ProcessResultType {
    pc_type: string;
    conditions: resultCondition[];
  }

  interface resultCondition {
    task_id: string;
    condition: resultConditionItem[];
    expression: string;
  }

  interface resultConditionItem {
    sign: string;
    target: string;
    condition: string;
  }
  export interface ProcessControlType {
    processControlOptions: any[];
    processControlStatus: ProcessStatusType;
    processControlResult: ProcessResultType;
  }
}

const useProcessControlStore = defineStore("processControl", {
  state: (): processControl.ProcessControlType => ({
    // 流程控制任务id options
    processControlOptions: [],
    // 流程控制参数
    processControlStatus: {
      pc_type: "",
      conditions: []
    },
    processControlResult: {
      pc_type: "",
      conditions: []
    }
  })
});

export default useProcessControlStore;

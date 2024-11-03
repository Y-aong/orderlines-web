import { BaseResponse } from "@/api/interface/index";

export namespace Option {
  export interface OptionItem {
    label: string;
    value: string;
  }
  export interface OptionResponse extends BaseResponse {
    data: OptionItem[];
  }

  export interface PrevNodeResult {
    result_config_options: ResultConfigOption[];
    pre_task_config: ResultConfigOption[];
  }

  interface ResultConfigOption {
    label: string;
    value: string;
  }
  // 流程控制节点后置节点信息
  export interface NextNode {
    label: string;
    value: string;
  }
}

import { BaseResponse } from "@/api/responseType";

export interface VariableItemType {
  id?: number | string;
  process_id?: string;
  process_name?: string;
  variable_key?: string;
  variable_value?: string;
  variable_desc?: string;
  variable_type?: string;
  is_cache?: boolean;
}

export type ItemsType = VariableItemType[];

export interface VariableResponseType extends BaseResponse {
  data: VariableItemType;
}

// 任务节点
export interface TaskNodeType {
  id?: number;
  task_id?: string;
  process_id: string;
  prev_id?: string;
  next_id?: string;
  task_name?: string;
  method_name?: string;
  method_kwargs?: any;
  creator?: any;
  updater?: string;
  task_type?: string;
  task_module?: string;
  task_config?: any;
  result_config?: any;
  desc?: string;
  module_version?: string;
}

// 获取任务参数
export interface TaskNodeRequestType {
  method_name?: string;
  class_name?: string;
  version?: string;
}

export interface TaskNodeDetailResponseType extends BaseResponse {
  data: TaskNodeType;
}

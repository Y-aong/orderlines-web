import { ReqPage, ResPage } from "@/api/interface/index";
export namespace TaskInstance {
  export interface Method_kwargs {}

  export interface Task_config {
    callback_func: string;
    callback_module: string;
    notice_type: string;
    retry_time: number;
    task_strategy: string;
    timeout: number;
  }

  export interface TaskInstanceItem {
    active: number;
    end_time: string;
    id: number;
    method_kwargs: Method_kwargs;
    method_name: string;
    process_id: string;
    process_instance_id: string;
    result_config?: any;
    runner?: any;
    runner_id?: any;
    start_time: string;
    task_config: Task_config;
    task_desc?: any;
    task_error_info: string;
    task_id: string;
    task_instance_id: string;
    task_module: string;
    task_name: string;
    task_result?: any;
    task_status: string;
    task_type: string;
  }
  export interface TaskInstanceFilter extends ReqPage {
    task_status?: string;
    process_instance_id?: string;
  }

  export interface TaskInstanceResponse extends ResPage<TaskInstanceItem> {}
}

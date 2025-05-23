import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Task {
  export interface TaskItem {
    desc?: string;
    id?: number;
    insert_time?: string;
    method_kwargs?: any;
    method_name?: string;
    module_version?: string;
    next_id?: string;
    prev_id?: string;
    process_id: string;
    result_config?: any;
    task_config?: any;
    task_id?: string;
    task_module?: string;
    task_name?: string;
    task_type?: string;
    update_time?: string;
    breakpoint?: number;
    creator_name?: string;
    creator_id?: number;
    updater_name?: string;
    updater_id?: number;
    version?: string;
  }

  export interface TaskGroup {
    task_id: string;
    method_kwargs?: any;
  }
  export interface TaskFilter extends ReqPage {
    id?: number;
    task_name?: string;
    process_id?: string;
    task_id?: string;
    creator?: string;
    updater?: string;
    insert_time?: string;
    update_time?: string;
  }

  export interface TaskResponse extends ResPage<TaskItem> {}
}

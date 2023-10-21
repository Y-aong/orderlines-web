import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Task {
  export interface TaskItem {
    creator?: any;
    creator_id?: any;
    desc?: string;
    id?: number;
    insert_time?: string;
    method_kwargs?: any;
    method_name?: string;
    module_version?: string;
    next_id?: any;
    prev_id?: any;
    process_id: string;
    result_config?: any;
    task_config?: any;
    task_id?: string;
    task_module?: string;
    task_name?: string;
    task_type?: string;
    update_time?: any;
    updater?: any;
    updater_id?: any;
  }
  export interface TaskFilter extends ReqPage {
    id?: number;
    task_name?: string;
    task_id?: string;
    creator?: string;
    updater?: string;
    insert_time?: string;
    update_time?: string;
  }

  export interface TaskResponse extends ResPage<TaskItem> {}
}

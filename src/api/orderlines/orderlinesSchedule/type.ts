import { ResPage } from "@/api/interface";

export namespace ScheduleTask {
  export interface ScheduleTaskItem {
    active: number;
    creator?: string;
    creator_id?: string;
    desc: string;
    id: number;
    insert_time: string;
    invalid_end_time?: string;
    invalid_start_time?: string;
    process_config?: any;
    process_id: string;
    process_name: string;
    process_params?: any;
    schedule_plan: any;
    schedule_plan_id: number;
    schedule_task_name: string;
    trigger: string;
    update_time: string;
    updater?: string;
    updater_id?: number;
  }
  export interface ScheduleTaskFilter {
    id?: string;
    process_name?: string;
    process_id?: string;
    process_version?: string;
  }
  export interface ScheduleTaskResponse extends ResPage<ScheduleTaskItem> {}
}

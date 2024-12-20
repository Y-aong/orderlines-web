import { ReqPage, ResPage } from "@/api/interface/index";

export namespace ProcessAlarm {
  export interface AlarmItem {
    id: number;
    process_name: string;
    process_id: string;
    process_instance_id: string;
    task_id: string;
    task_name: string;
    error_info: string;
    people_confirm: boolean;
    insert_time: string;
    update_time: string;
    creator_name: string;
    creator_id: number;
    updater_name: string;
    updater_id: number;
    active: boolean;
  }

  export interface AlarmFilter extends ReqPage {
    id?: number;
    task_name?: string;
    process_name?: string;
    process_instance_id?: string;
    people_confirm?: boolean;
  }

  export interface AlarmResponse extends ResPage<AlarmItem> {}

  export interface LoggerFilter extends ReqPage {
    id?: number;
    api_path?: string;
    method?: string;
    state?: string;
    visitor?: string;
    message?: string;
  }

  export interface LoggerItem {
    id: number;
    insert_time: string;
    update_time: string;
    creator_name: string;
    creator_id: number;
    updater_name: string;
    updater_id: number;
    active: boolean;
    api_path: string;
    method: string;
    state: string;
    visitor: string;
    message: string;
  }
}

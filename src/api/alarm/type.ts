import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Alarm {
  export interface AlarmItem {
    id: number;
    active: number;
    task_name: string;
    process_name: string;
    process_instance_id: string;
    people_confirm: boolean;
    update_time: string;
    updater_id?: any;
    updater_name?: any;
    version: string;
  }
  export interface AlarmFilter extends ReqPage {
    id?: number;
    task_name?: string;
    process_name?: string;
    process_instance_id?: string;
    people_confirm?: boolean;
  }

  export interface AlarmResponse extends ResPage<AlarmItem> {}
}

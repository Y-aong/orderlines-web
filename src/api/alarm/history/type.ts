import { ReqPage, ResPage } from "@/api/interface/index";

export namespace AlarmHistory {
  export interface AlarmHistoryItem {
    id: number;
    job_name: string;
    group_name: string;
    instance_name: string;
    job_status: string;
    confirm: boolean;
    insert_time: string;
    update_time: string;
    duration_time: string;
    alert_data: any;
    annotations: string;
  }

  export interface Filter extends ReqPage {
    job_name?: string;
    group_name?: string;
    instance_name?: string;
    job_status?: string;
    confirm?: boolean;
  }

  export interface AlarmNoticeResponse extends ResPage<AlarmHistoryItem[]> {}
}

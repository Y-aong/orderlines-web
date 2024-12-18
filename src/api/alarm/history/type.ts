import { ReqPage, ResPage } from "@/api/interface/index";

export namespace AlarmHistory {
  export interface AlarmHistoryItem {
    id: number;
    job_name: string;
    instance_name: string;
    job_status: string;
    confirm: boolean;
    alert_start_time: string;
    alert_end_time: string;
    duration_time: string;
    alert_data: any;
    annotations: string;
  }

  export interface Filter extends ReqPage {
    job_name: string;
    instance_name: number;
    job_status: string;
    confirm: boolean;
  }

  export interface AlarmNoticeResponse extends ResPage<AlarmHistoryItem> {}
}

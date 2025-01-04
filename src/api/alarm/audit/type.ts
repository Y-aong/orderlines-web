import { ReqPage, ResPage } from "@/api/interface/index";

export namespace AlarmAudit {
  export interface AlarmAuditItem {
    id?: number;
    group_name: string;
    instance_name: string;
    alarm_name: string;
    alarm_label: string;
    alarm_level: string;
    handle_name: string;
    duration_time: string;
    status: string;
    source: string;
    created_at: string;
    updated_at: string;
    link: string;
    comments: string;
    version: string;
    category?: string;
  }

  export interface Filter extends ReqPage {
    alarm_name: string;
    handle_name: string;
    alarm_label: string;
    alarm_level: string;
    version: string;
    category: string;
    source: string;
    status: string;
    duration_time: string;
  }

  export interface AlarmAuditResponse extends ResPage<AlarmAuditItem> {}
}

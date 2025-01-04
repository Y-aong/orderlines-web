import { ReqPage, ResPage } from "@/api/interface/index";
export namespace AlarmRules {
  export interface RuleItem {
    id: string;
    group_name: string;
    instance_name: string;
    job_name: string;
    alert_name: string;
    alert_rule: string;
    threshold: string;
    comparison_mode: string;
    duration_time: string;
    alarm_lever: string;
    annotations: string;
    restrain_alarm: boolean;
    alarm_status: boolean;
    notice_name: string[];
    notice_group: string[];
    notice_type: string;
  }

  export interface Filter extends ReqPage {
    id?: number;
    task_name?: string;
    process_name?: string;
    process_instance_id?: string;
    people_confirm?: boolean;
  }

  export interface AlarmRulesResponse extends ResPage<RuleItem> {}
}

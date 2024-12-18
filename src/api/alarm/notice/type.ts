import { ReqPage, ResPage } from "@/api/interface/index";

export namespace AlarmNotice {
  export interface AlarmNoticeItem {
    id: number;
    alarm_type: string;
    notice_group_id: number;
    notice_group_name: string;
    notice_id: string;
    notice_name: string;
  }

  export interface Filter extends ReqPage {
    alarm_type: string;
    notice_group_id: number;
    notice_group_name: string;
    notice_id: string;
    notice_name: string;
  }

  export interface AlarmNoticeResponse extends ResPage<AlarmNoticeItem> {}
}

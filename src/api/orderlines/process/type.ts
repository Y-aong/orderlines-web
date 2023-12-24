import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Process {
  export interface ProcessItem {
    id?: number;
    creator?: any;
    creator_id?: any;
    desc: string;
    insert_time?: string;
    process_config: string;
    process_id: string;
    process_name: string;
    process_params: string;
    update_time?: any;
    updater?: any;
    updater_id?: any;
    version?: any;
  }
  export interface ProcessFilter extends ReqPage {
    id?: number;
    process_name?: string;
    process_id?: string;
    creator?: string;
    updater?: string;
    insert_time?: string;
    update_time?: string;
  }

  export interface ProcessParamType {
    timeout: number;
    notice_type: string;
    is_send: boolean;
    process_id: string;
  }

  export interface ProcessResponse extends ResPage<ProcessItem> {}
}

import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Process {
  export interface ProcessItem {
    id?: number;
    process_id: string;
    process_name: string;
    version: string;
    namespace: string;
    creator_name?: string;
    creator_id?: number;
    desc?: string;
    insert_time?: string;
    process_config: ProcessConfig;
    process_params?: any;
    update_time?: string;
    updater_name?: string;
    updater_id?: number;
    mode?: string;
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
  export interface ProcessHtmlFilter extends ReqPage {
    process_instance_id: string;
  }

  export interface SetupTearDownItem {
    name: string;
    method_kwargs: any;
  }
  export interface ProcessConfig {
    setup: SetupTearDownItem;
    teardown: SetupTearDownItem;
    timeout: number;
    notice_type: string;
    is_send: boolean;
  }

  export interface ProcessResponse extends ResPage<ProcessItem> {}
}

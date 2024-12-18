import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Conf {
  export interface ConfItem {
    id: number;
    active: number;
    config_name: string;
    config_value: string;
    creator_id?: any;
    creator_name?: any;
    desc: string;
    insert_time: string;
    update_time?: any;
    updater_id?: any;
    updater_name?: any;
  }
  export interface ConfFilter extends ReqPage {
    id?: number;
    process_name?: string;
    variable_key?: string;
    creator?: string;
  }

  export interface ConfResponse extends ResPage<ConfItem> {}
}

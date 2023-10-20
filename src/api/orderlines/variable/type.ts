import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Variable {
  export interface VariableItem {
    active: number;
    creator_id?: any;
    creator_name?: any;
    id: number;
    insert_time?: any;
    is_cache?: any;
    process_id: string;
    process_name: string;
    update_time?: any;
    updater_id?: any;
    updater_name?: any;
    variable_desc: string;
    variable_key: string;
    variable_type: string;
    variable_value: string;
  }
  export interface VariableFilter extends ReqPage {
    id?: number;
    process_name?: string;
    variable_key?: string;
    creator?: string;
  }

  export interface VariableResponse extends ResPage<VariableItem> {}
}

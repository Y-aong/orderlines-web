import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Variable {
  export interface VariableItem {
    creator_id?: string;
    creator_name?: string;
    id?: number;
    insert_time?: string;
    is_cache?: boolean;
    is_global: boolean;
    process_id?: string;
    process_name?: string;
    update_time?: string;
    updater_id?: string;
    updater_name?: string;
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
    is_global?: boolean;
  }

  export interface VariableResponse extends ResPage<VariableItem> {}
}

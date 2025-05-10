import { ReqPage, ResPage } from "@/api/interface/index";
export namespace VariableInstance {
  export interface VariableInstanceItem {
    active: number;
    id: number;
    is_cache: boolean;
    is_global: boolean;
    process_id: string;
    process_instance_id: string;
    process_name: string;
    variable_desc: string;
    variable_key: string;
    variable_type: string;
    variable_value: string;
  }
  export interface VariableInstanceFilter extends ReqPage {
    id?: number;
    process_name?: string;
    variable_key?: string;
    is_global?: boolean;
    creator?: string;
  }

  export interface VariableInstanceResponse extends ResPage<VariableInstanceItem> {}
}

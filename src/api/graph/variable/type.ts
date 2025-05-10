// flow 变量相关
export namespace GraphVariable {
  export interface VariableItem {
    active: number;
    creator_id?: number;
    creator_name?: string;
    id: number;
    insert_time?: string;
    is_cache?: boolean;
    is_global: boolean;
    process_id: string;
    process_name: string;
    update_time?: string;
    updater_id?: number;
    updater_name?: string;
    variable_desc: string;
    variable_key: string;
    variable_type: string;
    variable_value: string;
  }

  export interface VariableOption {
    label: string;
    value: string;
  }
}

// flow 变量相关
export namespace FlowVariable {
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

  export interface VariableOption {
    label: string;
    value: string;
  }
}

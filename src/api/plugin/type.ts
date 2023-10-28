import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Plugin {
  export interface Parameter {
    default?: any;
    desc: string;
    name: string;
    required: boolean;
    title: string;
    type: string;
  }

  export interface Return_value {
    default?: any;
    desc: string;
    name: string;
    required: boolean;
    title: string;
    type: string;
  }

  export interface PluginItem {
    active: number;
    background: string;
    class_name: string;
    creator_id?: any;
    creator_name?: any;
    id: number;
    insert_time: string;
    method_desc: string;
    method_name: string;
    node_type: string;
    parameters: Parameter[];
    return_value: Return_value[];
    title: string;
    update_time: string;
    updater_id?: any;
    updater_name?: any;
    version: string;
  }
  export interface PluginFilter extends ReqPage {
    id?: number;
    class_name?: string;
    method_name?: string;
    node_type?: string;
  }
  export interface PluginMangerFilter extends ReqPage {
    id?: number;
    model_name?: string;
    file_name?: string;
  }
  export interface PluginManagerItem {
    active: number;
    id: number;
    insert_time: string;
    update_time: string;
    model_name: string;
    file_name: string;
    enable: number;
  }

  export interface PluginResponse extends ResPage<PluginItem> {}
}

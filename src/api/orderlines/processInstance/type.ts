import { ReqPage, ResPage } from "@/api/interface/index";
export namespace PInstance {
  export interface ProcessInstanceItem {
    active: number;
    end_time: string;
    id: number;
    process_config: string;
    process_error_info: string;
    process_id: string;
    process_instance_id: string;
    process_name: string;
    process_params: string;
    process_status: string;
    run_type: string;
    runner?: any;
    runner_id?: any;
    start_time: string;
  }
  export interface ProcessInstanceFilter extends ReqPage {
    id?: number;
    process_name?: string;
    process_id?: string;
    insert_time?: string;
    update_time?: string;
  }

  export interface ProcessInstanceResponse extends ResPage<ProcessInstanceItem> {}

  export interface Children {
    id: string;
    name: string;
  }

  export interface ProcessOption {
    children: Children[];
    id: string;
    name: string;
  }
}

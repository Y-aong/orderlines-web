import { ReqPage, ResPage } from "@/api/interface/index";
export namespace PrometheusInstance {
  export interface PrometheusInstanceItem {
    instance_name: string;
    job_name: string;
    job_status: string;
    confirm: boolean;
    annotations: any;
    duration_time: string;
    img_url: string;
  }

  export interface Filter extends ReqPage {
    instance_name?: string;
    job_name?: string;
    job_status?: string;
    confirm?: boolean;
  }

  export interface PrometheusInstanceResponse extends ResPage<PrometheusInstanceItem> {}
}

export namespace PrometheusNodeMetrics {
  export interface PieType {
    value: number;
    name: string;
  }
  export interface PrometheusNodeMetrics {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    disk_used_data: PieType[];
    memory_used_data: any;
    swap_used_data: PieType[];
    cpu_total: string;
    boot_time: string;
    memory_total_gb: string;
    disk_total_gb: string;
    swap_total_gb: string;
  }

  export interface Filter extends ReqPage {
    step?: string;
    start_time?: string;
    end_time?: string;
  }
  export interface LineType {
    name: string;
    date: string[];
  }
}

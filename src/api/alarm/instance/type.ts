import { ReqPage, ResPage } from "@/api/interface/index";
export namespace PrometheusInstance {
  export interface PrometheusInstanceItem {
    id: number;
    instance_name: string;
    group_name: string;
    job_name: string;
    alarm_level: string;
    job_status: string;
    confirm: boolean;
    annotations: string;
    duration_time: string;
    img_url: string;
    update_time: string;
    insert_time: string;
  }

  export interface Filter extends ReqPage {
    instance_name?: string;
    job_name?: string;
    job_status?: string;
    confirm?: boolean;
  }
  export interface AlarmConfirmItem {
    id: number;
    confirm: boolean;
    // 告警审计
    group_name: string;
    instance_name: string;
    update_name: string;
    job_name: string;
    alarm_label: string;
    alarm_level: string;
    handle_name: string;
    duration_time: string;
    status: string;
    source: string;
    created_at: string;
    updated_at: string;
    link: string;
    comments: string;
    version: string;
    category: string;
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

  export interface Filter {
    step?: string;
    start_time?: string;
    end_time?: string;
  }
  export interface LineType {
    name: string;
    date: string[];
  }
}

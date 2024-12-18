import { ReqPage, ResPage } from "@/api/interface/index";
export namespace JenkinsInstance {
  export interface JenkinsInstanceItem {
    id?: number;
    creator_name?: string;
    creator_id?: number;
    insert_time?: string;
    update_time?: string;
    updater_name?: string;
    updater_id?: number;
    active?: boolean;

    name: string;
    url: string;
    parameter: any;
    description: string;
    build_number: number;
    build_url: string;
    build_status: string;
    start_time: string;
  }
  export interface JenkinsInstanceFilter extends ReqPage {
    id?: number;
    name?: string;
    description?: string;
    build_number?: string;
    build_status?: string;
  }
  export interface JenkinsInfoResponse extends ResPage<JenkinsInstanceItem> {}
}

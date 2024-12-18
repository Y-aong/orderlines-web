import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Jenkins {
  export interface JenkinsInfoItem {
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
    color: string;
    description: string;
    build_able: boolean;
  }
  export interface JenkinsInfoFilter extends ReqPage {
    id?: number;
    name?: string;
    description?: string;
  }
  export interface JenkinsInfoResponse extends ResPage<JenkinsInfoItem> {}
}

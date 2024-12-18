import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Logger {
  export interface ApiLoggerFilter extends ReqPage {
    id?: number;
    api_path?: string;
    method?: string;
    state?: string;
    visitor?: string;
    message?: string;
  }

  export interface ApiLoggerItem {
    id: number;
    insert_time: string;
    update_time: string;
    creator_name: string;
    creator_id: number;
    updater_name: string;
    updater_id: number;
    active: boolean;
    api_path: string;
    method: string;
    state: string;
    visitor: string;
    message: string;
  }
  export interface ApiLoggerResponse extends ResPage<ApiLoggerItem> {}
}

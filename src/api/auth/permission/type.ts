import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Permission {
  export interface PermissionItem {
    id?: number;
    name: string;
    menu: boolean;
    method: string;
    path: string;
    pid?: number;
    desc: string;
    insert_time: string;
    update_time?: string;
    creator_name?: string;
    creator_id?: number;
    updater_name: string;
    updater_id?: number;
    active: number;
  }
  export interface PermissionFilter extends ReqPage {
    id?: number;
    name?: string;
    desc?: string;
  }

  export interface PermissionResponse extends ResPage<PermissionItem> {}

  export interface PermissionTag {
    GET: string;
    POST: string;
    PUT: string;
    DELETE: string;
  }
}

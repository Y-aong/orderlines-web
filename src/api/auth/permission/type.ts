import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Permission {
  export interface PermissionItem {
    id?: number;
    desc: string;
    insert_time: string;
    menu: boolean;
    method: string;
    name: string;
    path: string;
    update_time: string;
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

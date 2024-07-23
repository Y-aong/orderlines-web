import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Role {
  export interface RoleItem {
    id?: number;
    role_name: string;
    desc: string;
    insert_time: string;
    update_time?: string;
    creator_name?: string;
    creator_id?: number;
    updater_name?: string;
    updater_id?: number;
    active: number;
  }
  export interface RoleFilter extends ReqPage {
    id?: number;
    role_name?: string;
    desc?: string;
  }

  export interface RoleResponse extends ResPage<RoleItem> {}
}

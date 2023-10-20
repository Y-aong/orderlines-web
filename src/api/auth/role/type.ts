import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Role {
  export interface RoleItem {
    id?: number;
    desc: string;
    role_name: string;
    insert_time: string;
    update_time: string;
  }
  export interface RoleFilter extends ReqPage {
    id?: number;
    role_name?: string;
    desc?: string;
  }

  export interface RoleResponse extends ResPage<RoleItem> {}
}

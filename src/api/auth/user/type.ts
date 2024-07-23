import { ReqPage, ResPage } from "@/api/interface/index";
export namespace User {
  export interface UserItem {
    id?: number;
    username: string;
    email: string;
    phone: string;
    password?: string;
    img_url: string;
    group_owner: boolean;
    dept_id: number;
    insert_time: string;
    update_time: string;
    creator_name?: string;
    creator_id?: number;
    updater_name?: string;
    updater_id?: number;
    active: number;
  }
  export interface UserFilter extends ReqPage {
    id?: number;
    username?: string;
    phone?: string;
    email?: string;
  }

  export interface UserResponse extends ResPage<UserItem> {}
}

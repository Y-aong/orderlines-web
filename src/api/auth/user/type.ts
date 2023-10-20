import { ReqPage, ResPage } from "@/api/interface/index";
export namespace User {
  export interface UserItem {
    id?: number;
    desc: string;
    username: string;
    phone?: string;
    email?: string;
    insert_time: string;
    update_time: string;
  }
  export interface UserFilter extends ReqPage {
    id?: number;
    username?: string;
    phone?: string;
    email?: string;
  }

  export interface UserResponse extends ResPage<UserItem> {}
}

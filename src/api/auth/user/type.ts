import { ReqPage } from "@/api/interface/index";

export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    email: string;
    phone: string;
    insert_time: string;
  }

  export interface ResUserList {
    id?: string;
    active?: boolean;
    username: string;
    email?: string;
    phone?: string;
    insert_time: string;
    img_url?: string;
    group_owner?: string;
    dept_id?: number;
  }
}

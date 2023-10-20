import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Group {
  export interface GroupItem {
    id?: number;
    desc: string;
    group_name: string;
    insert_time: string;
    owner_id?: number;
    owner_name?: number;
    update_time: string;
  }
  export interface GroupFilter extends ReqPage {
    id?: number;
    group_name?: string;
    group_desc?: string;
    group_owner?: string;
  }

  export interface GroupResponse extends ResPage<GroupItem> {}
}

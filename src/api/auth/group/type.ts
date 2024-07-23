import { ReqPage, ResPage } from "@/api/interface/index";
export namespace Group {
  export interface GroupItem {
    id: number;
    group_name: string;
    desc: string;
    owner_id: number;
    owner_name: string;
    insert_time: string;
    update_time: string;
    creator_name: null;
    creator_id: null;
    updater_name: null;
    updater_id: null;
    active: number;
  }
  export interface GroupFilter extends ReqPage {
    id?: number;
    group_name?: string;
    group_desc?: string;
    group_owner?: string;
  }

  export interface GroupResponse extends ResPage<GroupItem> {}
}

import { ReqPage, ResPage } from "@/api/interface/index";
export namespace GitlabBranch {
  export interface GitlabBranchItem {
    id?: number;
    creator_name?: string;
    creator_id?: number;
    insert_time?: string;
    update_time?: string;
    updater_name?: string;
    updater_id?: number;
    active?: boolean;

    project_id: number;
    project_name: string;
    project_url: string;
    branch_name: string;
    is_default: boolean;
    protected: boolean;
    can_push: boolean;
    branch_url: string;
  }
  export interface GitlabBranchFilter extends ReqPage {
    id?: number;
    project_id?: number;
    project_name?: string;
    branch_name?: string;
  }
  export interface GitlabBranchResponse extends ResPage<GitlabBranchItem> {}
}

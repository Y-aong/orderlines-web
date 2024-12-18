import { ReqPage, ResPage } from "@/api/interface/index";
export namespace GitlabCommit {
  export interface GitlabCommitItem {
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
    commit_id: string;
    commit_title: string;
    commit_message: string;
    author_name: string;
    created_at: string;
    commit_url: string;
  }
  export interface GitlabCommitFilter extends ReqPage {
    id?: number;
    project_id?: number;
    project_name?: string;
    commit_id?: string;
    commit_title?: string;
    commit_message?: string;
    author_name?: string;
  }
  export interface GitlabCommitResponse extends ResPage<GitlabCommitItem> {}
}

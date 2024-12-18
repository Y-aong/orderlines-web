import { ReqPage, ResPage } from "@/api/interface/index";
export namespace GitlabProject {
  export interface GitlabProjectItem {
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
    description: any;
    create_time: string;
    visibility: boolean;
    archived: boolean;
    owner_id: number;
    owner_name: string;
    project_url: string;
  }
  export interface GitlabProjectFilter extends ReqPage {
    id?: number;
    project_id?: number;
    project_name?: string;
    description?: string;
    owner_id?: string;
    owner_name?: string;
  }
  export interface GitlabProjectResponse extends ResPage<GitlabProjectItem> {}
}

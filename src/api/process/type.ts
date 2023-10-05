import { BaseResponse } from "@/api/responseType";

export interface ProcessItemType {
  id?: number;
  process_id?: string;
  creator?: any;
  process_params?: string | {} | undefined;
  process_config?: string | {} | undefined;
  process_name: string | {} | undefined;
  desc?: string | {} | undefined;
  update_time?: string;
  updater?: string;
}

export type ItemType = ProcessItemType[];

export interface ProcessDataType {
  items: ItemType;
  total: number;
}

export interface ProcessResponseType extends BaseResponse {
  data: ProcessDataType;
}

export interface queryProcessType {
  keyword?: string;
  process_name?: string;
  process_id?: string;
  desc?: string;
  creator?: string;
  updater?: string;
  page: number;
  pre_page: number;
}

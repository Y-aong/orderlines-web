import { BaseResponse } from "@/api/interface/index";

export namespace Option {
  export interface OptionItem {
    label: string;
    value: string;
  }
  export interface OptionResponse extends BaseResponse {
    data: OptionItem[];
  }
}

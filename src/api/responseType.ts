export interface BaseResponse {
  code: number;
  success: boolean;
  message: string;
}

export interface BaseAbort {
  success: boolean;
  code: number;
  message: string;
}

export interface BaseDate {
  table_id: number;
}

export interface BaseCreateResponse extends BaseResponse {
  data: BaseDate;
}

export interface BaseUpdateResponse extends BaseResponse {
  data: BaseDate;
}

export interface BaseDeleteResponse extends BaseResponse {
  data: BaseDate;
}

export interface DeleteRequest {
  id: number;
}

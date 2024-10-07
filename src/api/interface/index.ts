// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    token: string;
  }
  export interface ResUserInfo {
    login_type: string;
    login_value: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

export interface Result {
  code: number;
  success: boolean;
  message: string;
}
// 请求响应参数（包含data）
export interface BaseResponse<T = any> extends Result {
  data: T;
}

export interface BaseData {
  table_id: number;
}
// 基本创建请求
export interface BaseCreateResponse extends BaseResponse {
  data: BaseData;
}
// 基本修改请求
export interface BaseUpdateResponse extends BaseResponse {
  data: BaseData;
}

export interface DeleteData {
  id: number;
}
// 基本删除请求
export interface BaseDeleteResponse extends BaseResponse {
  data: DeleteData;
}

export interface OptionItemType {
  label: string;
  value: string;
}

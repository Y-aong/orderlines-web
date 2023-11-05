// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}
export interface BaseUpdate {
  table_id: number;
}

export interface BaseCreate extends BaseUpdate {}
export interface BaseDelete extends BaseUpdate {}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

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
export interface DeleteRes {
  id: number;
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
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

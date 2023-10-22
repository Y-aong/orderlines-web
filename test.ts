[
  {
    data: {
      message: {
        message: "获取不到前置节点返回值",
        success: false,
        code: 400
      }
    },
    status: 400,
    statusText: "BAD REQUEST",
    headers: {
      "content-length": "126",
      "content-type": "application/json"
    },
    config: {
      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      },
      adapter: "xhr",
      transformRequest: [null],
      transformResponse: [null],
      timeout: 30000,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {},
      headers: {
        Accept: "application/json, text/plain, */*",
        "x-access-token":
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbl90eXBlIjoidXNlcm5hbWUiLCJsb2dpbl92YWx1ZSI6Im9yZGVybGluZXMiLCJwYXNzd29yZCI6Im9yZGVybGluZXMiLCJleHAiOjE2OTc5NzQxOTJ9.N4YgATjjLFIx_gvyuVHwpwg6zPnYP4ISrOw8CrYZAMY"
      },
      baseURL: "http://localhost:15900",
      withCredentials: true,
      method: "get",
      url: "/prev_node_result?task_id=2187ee5b-9b4a-4a1c-b291-2847dc65299c&process_id=0d6e263f-4970-4209-ac9f-a2004b0a726b",
      loading: false
    },
    request: {}
  }
];

export interface Message {
	message: string;
	success: boolean;
	code: number;
}

export interface Data {
	message: Message;
}

export interface Header {
	content-length: string;
	content-type: string;
}

export interface Transitional {
	silentJSONParsing: boolean;
	forcedJSONParsing: boolean;
	clarifyTimeoutError: boolean;
}

export interface Env {}

export interface Header {
	accept: string;
	x-access-token: string;
}

export interface Config {
	transitional: Transitional;
	adapter: string;
	transformRequest: any[];
	transformResponse: any[];
	timeout: number;
	xsrfCookieName: string;
	xsrfHeaderName: string;
	maxContentLength: number;
	maxBodyLength: number;
	env: Env;
	headers: Header;
	baseURL: string;
	withCredentials: boolean;
	method: string;
	url: string;
	loading: boolean;
}

export interface Request {}

export interface RootObject {
	data: Data;
	status: number;
	statusText: string;
	headers: Header;
	config: Config;
	request: Request;
}

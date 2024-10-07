import { Login } from "@/api/interface/index";
import authMenuList from "@/assets/json/authMenuList.json";
import authButtonList from "@/assets/json/authButtonList.json";
import http from "@/api";

enum API {
  LOGIN_URL = "/token/",
  LOGOUT_URL = "/token/logout",
  TOKEN_CHECK_URL = "/token/check",
  TOKEN_REFRESH_URL = "/token/refresh",
  TOKEN_REGISTER_URL = "/token/register",
  TOKEN_USER_INFO_URL = "/token/user_info"
}

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(API.LOGIN_URL, params, { loading: false }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(`/login`, params, { loading: false }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(`/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(`/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(`/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
};

export const checkTokenApi = (token: string) => {
  return http.get<Login.ResLogin>(`${API.TOKEN_CHECK_URL}?token=${token}`, { loading: false });
};
export const getUserInfoApi = (token: string) => {
  return http.get<Login.ResUserInfo>(`${API.TOKEN_USER_INFO_URL}?token=${token}`, { loading: false });
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  return authMenuList;
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return authButtonList;
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(API.LOGOUT_URL, {}, { loading: false });
};

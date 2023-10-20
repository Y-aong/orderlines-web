import http from "@/api";

//项目用户相关的请求地址
enum API {
  ROLE_URL = "/role"
}

export const getRoleRequest = (data: any) => http.get(API.ROLE_URL, data);
export const createRoleRequest = (data: any) => http.post(API.ROLE_URL, data);
export const updateRoleRequest = (data: any) => http.put(API.ROLE_URL, data);
export const deleteRoleRequest = (data: any) => http.delete(API.ROLE_URL, { params: data });

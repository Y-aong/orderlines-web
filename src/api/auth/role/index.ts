import http from "@/api";
import { Role } from "./type";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  ROLE_URL = "/oauth/role",
  ROLE_DETAIL_URL = "/oauth/role/detail"
}

export const getRoleDetailRequest = (id: string) => http.get<Role.RoleItem>(`${API.ROLE_URL}?id=${id}`);
export const getRoleRequest = (data: Role.RoleFilter) => http.get<Role.RoleItem[]>(API.ROLE_URL, data);
export const createRoleRequest = (data: Role.RoleItem) => http.post<BaseData>(API.ROLE_URL, data);
export const updateRoleRequest = (data: Role.RoleItem) => http.put<BaseData>(API.ROLE_URL, data);
export const deleteRoleRequest = (id: string) => http.delete<DeleteData>(`${API.ROLE_URL}?id=${id}`);

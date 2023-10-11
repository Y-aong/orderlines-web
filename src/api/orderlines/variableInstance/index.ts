import http from "@/api";

enum API {
  VARIABLE_INSTANCE_URL = "/variable_instance"
}

export const getVariableInstanceRequest = (data: any) =>
  http.get(`${API.VARIABLE_INSTANCE_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize ? data.pageSize : 10}`);

export const createVariableInstanceRequest = (data: any) => http.post(API.VARIABLE_INSTANCE_URL, data);

export const updateVariableInstanceRequest = (data: any) => http.put(API.VARIABLE_INSTANCE_URL, data);

export const deleteVariableInstanceRequest = (data: any) => http.delete(API.VARIABLE_INSTANCE_URL, { params: data });

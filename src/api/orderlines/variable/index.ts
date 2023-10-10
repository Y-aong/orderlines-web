import http from "@/api";

enum API {
  VARIABLE_URL = "/variable"
}

export const getVariableRequest = (data: any) =>
  http.get(`${API.VARIABLE_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize ? data.pageSize : 10}`);

export const createVariableRequest = (data: any) => http.post(API.VARIABLE_URL, data);

export const updateVariableRequest = (data: any) => http.put(API.VARIABLE_URL, data);

export const deleteVariableRequest = (data: any) => http.delete(API.VARIABLE_URL, { params: data });

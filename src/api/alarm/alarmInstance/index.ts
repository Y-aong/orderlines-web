import http from "@/api";
import { PrometheusInstance, PrometheusNodeMetrics } from "./type";
import { BaseData } from "@/api/interface";

enum API {
  PROMETHEUS_INSTANCE_URL = "/alarm/prometheus/instance",
  PROMETHEUS_NODE_METRICS_URL = "/alarm/node_metrics",
  PROMETHEUS_NODE_METRICS_NETWORK_URL = "/alarm/node_metrics/network",
  PROMETHEUS_NODE_METRICS_CPU_URL = "/alarm/node_metrics/cpu",
  PROMETHEUS_NODE_METRICS_MEMORY_URL = "/alarm/node_metrics/memory"
}

export const getPrometheusInstanceRequest = (data: PrometheusInstance.Filter) =>
  http.get<BaseData>(API.PROMETHEUS_INSTANCE_URL, data);
// 获取指定instance监控数据
export const getPrometheusNodeMetricsRequest = (instance_name?: string, time_window?: string) =>
  http.get<PrometheusNodeMetrics.PrometheusNodeMetrics>(
    `${API.PROMETHEUS_NODE_METRICS_URL}?instance_name=${instance_name}&time_window=${time_window}`
  );
// 获取某段时间内的网络流量变化
export const getPrometheusNodeMetricsNetworkRequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.PROMETHEUS_NODE_METRICS_NETWORK_URL, data);
// 获取某段时间内的CPU使用变化
export const getPrometheusNodeMetricsCPURequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.PROMETHEUS_NODE_METRICS_CPU_URL, data);
//获取某段时间内的内存使用变化
export const getPrometheusNodeMetricsMemoryRequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.PROMETHEUS_NODE_METRICS_MEMORY_URL, data);

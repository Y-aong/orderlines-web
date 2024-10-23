export namespace FlowOperator {
  // 子流程参数
  export interface SubprocessParmaType {
    process_id: string;
    variable_key: string;
    variable_value: string;
    variable_type: string;
    variable_desc: string;
  }
  export interface ProcessVersionType {
    id?: number;
    process_id: string;
    process_name?: string;
    desc?: string;
    version: string;
    namespace: string;
    version_desc: string;
    creator_name: string;
  }
  export interface CreateProcessVersion {
    process_id: string;
  }
}

export const conditionItem = {
  condition: "",
  target: "",
  sign: ""
};
export const branchItem = {
  task_id: "",
  condition: [{ sign: "", target: "", condition: "" }]
};

export const processControlStatusItem = {
  pc_type: "status",
  conditions: [
    {
      task_id: "",
      condition: [{ task_status: "", condition: "" }]
    },
    {
      task_id: "",
      condition: [{ task_status: "", condition: "" }]
    }
  ]
};

export const processControlResult = {
  pc_type: "result",
  conditions: [
    {
      task_id: "",
      condition: [{ sign: "", target: "", condition: "" }]
    }
  ]
};

export const taskStatusOptions = [
  {
    value: "SUCCESS",
    label: "运行成功"
  },
  {
    value: "FAILURE",
    label: "运行失败"
  }
];

export const signs = [
  {
    value: ">",
    label: ">"
  },
  {
    value: ">=",
    label: ">="
  },
  {
    value: "=",
    label: "="
  },
  {
    value: "<",
    label: "<"
  },
  {
    value: "<=",
    label: "<="
  },
  {
    value: "!=",
    label: "!="
  }
];

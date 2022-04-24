export interface AnyObj {
  [index: string]: any;
}

export interface BoolObj {
  [index: string]: boolean;
}

export interface StringObj {
  [index: string]: string;
}

export interface CommonOptionsItem {
  key: string;
  label?: string;
  selected?: boolean;
}

export type JobStatus = 'succeed' | 'failed' | 'waiting' | 'running' | 'start' | 'stopped';
export interface LogDataItems {
  id: string;
  label: string;
  time: string | number;
  status: JobStatus;
  uuid: string;
  value: any[];
}

// job list 表格过滤项
export type JobListFilterType = 'status' | 'arch' | 'type';
export type JobListfilterConfig = {
  [key in JobListFilterType]: string[];
};

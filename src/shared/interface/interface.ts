import { number } from "echarts";

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

export type JobStatus = 'succeed' | 'failed' | 'waiting' | 'running';
export interface LogDataItems {
  id: string;
  label: string;
  time: string | number;
  status: JobStatus;
  uuid: string;
  value: any[];
}

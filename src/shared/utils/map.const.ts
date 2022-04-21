import { JobStatus } from '../interface/interface';

// 配置图标
type statusIconMapConfig = {
  [index in JobStatus]: string;
};
export const statusIconMap: statusIconMapConfig = {
  succeed: 'tab-succeed',
  running: 'tab-running',
  failed: 'tab-failed',
  stopped: 'tab-failed',
  start: 'tab-waiting',
  waiting: 'tab-waiting',
};

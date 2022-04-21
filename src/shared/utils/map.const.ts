import { JobStatus } from '../interface/interface';

// 配置图标
type statusIconMapConfig = {
  [index in JobStatus]: string;
};
export const statusIconMap: statusIconMapConfig = {
  failed: 'tab-failed',
  stopped: 'tab-failed',
  succeed: 'tab-succeed',
  start: 'tab-waiting',
  waiting: 'tab-waiting',
  running: 'tab-running',
};

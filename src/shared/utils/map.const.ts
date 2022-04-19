import { JobStatus } from '../interface/interface';

// 配置图标
type statusIconMapConfig = {
  [index in JobStatus]: string;
};
export const statusIconMap: statusIconMapConfig = {
  failed: 'tab-failed',
  succeed: 'tab-succeed',
  waiting: 'tab-waiting',
  running: 'tab-running',
};

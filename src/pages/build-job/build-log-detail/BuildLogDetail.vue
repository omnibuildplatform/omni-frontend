/* eslint-disable vue/no-v-html */
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { onBeforeUnmount, reactive, ref } from 'vue';
import { statusIconMap } from '@/shared/utils/map.const';
import { AnyObj, LogDataItems, StringObj } from '@/shared/interface/interface';
import { timeRangeToRealTime } from '@/shared/utils/common';
import { useRoute } from 'vue-router';
import { getJobDetail, getJobStepDetail } from '@/api/api';

onBeforeUnmount(() => {
  timer && clearInterval(timer);
});
defineProps({
  name: {
    type: String,
    default: '--',
  },
});
const emit = defineEmits(['complete']);
const route = useRoute();
const id = (route.params.id || '') as string;
const fromIso = route?.fullPath?.includes('/build-iso/');
const param = fromIso
  ? {
      jobtype: 'buildimagefromiso',
    }
  : {};
const statusMap: AnyObj = {
  StepStart: 'waiting',
  StepCreated: 'waiting',
  StepRunning: 'running',
  StepSucceed: 'succeed',
  StepFailed: 'failed',
  StepStopped: 'stopped',
};
const jobStatusMap: AnyObj = {
  JobStart: 'waiting',
  JobCreated: 'waiting',
  JobRunning: 'running',
  JobSucceed: 'succeed',
  JobFailed: 'failed',
  JobStopped: 'stopped',
};
// 计算所用时间
const calcTime = (data: StringObj) => {
  const startTime = new Date(data.startTime)?.getTime() || -1;
  const endTime = new Date(data.endTime)?.getTime() || -1;
  if (startTime < 0 || endTime < 0) {
    return '';
  } else {
    const { str } = timeRangeToRealTime(startTime, endTime);
    return str;
  }
};
let timer: NodeJS.Timeout;
const queryJob = (type?: string) => {
  getJobDetail(id, param).then((res) => {
    if (res.data) {
      const { data } = res;
      const { steps = [] } = data;
      totalTime.value = calcTime(data);
      if (['JobStopped', 'JobFailed'].includes(data.state)) {
        timer && clearInterval(timer);
      }
      if (steps) {
        if (type === 'first') {
          // 第一次打开详情，有running状态的步骤，默认打开
          const findOne = steps.find((item: StringObj) => item.state === 'StepRunning');
          if (findOne) {
            activeNames.value.push(findOne?.id as never);
          }
        }

        const _data = steps.map((item: StringObj) => ({
          id: item.id,
          label: item.name,
          time: calcTime(item),
          uuid: '',
          status: statusMap[item.state],
          value: [],
        }));
        if (logDatas.value.length) {
          // 轮询时仅更新引用值
          logDatas.value.forEach((item, index) => {
            const { time, status } = _data[index];
            item.time = time;
            item.status = status;
          });
        } else {
          logDatas.value = _data;
        }
        complete(data.state, res.attach);
      }
      handleChange();
    }
  });
};
if (id) {
  queryJob('first');
  timer = setInterval(() => {
    queryJob();
  }, 5000);
}
// 请求完成向上冒泡
const percentageParam = reactive({
  percentage: 0,
  status: 'running',
  url: '',
});
const addTime = () => {
  if (percentageParam.percentage < 99) {
    percentageParam.percentage = Math.round(percentageParam.percentage * 10 + 1) / 10;
  }
};
const complete = (status: string, url?: string) => {
  addTime();
  const step = Math.floor(100 / logDatas.value.length);
  logDatas.value.forEach((item, index) => {
    if (item.status === 'running' && percentageParam.percentage < step * index) {
      percentageParam.percentage = step * index;
    }
  });
  if (jobStatusMap[status] === 'succeed') {
    timer && clearInterval(timer);
    percentageParam.percentage = 100;
    percentageParam.url = url || '';
  }
  percentageParam.status = jobStatusMap[status];
  emit('complete', percentageParam);
};
const totalTime = ref('');
const searchValue = ref('');
const activeNames = ref([]);
const handleChange = () => {
  activeNames.value.forEach((key) => {
    const findOne = logDatas.value.find((it) => key === it.id);
    // 值加载过一遍不用加载第二遍
    if (findOne && findOne.uuid !== 'end') {
      const params = {
        stepID: key,
        uuid: findOne.uuid,
        ...param,
      };
      getJobStepDetail(id, params).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          const { log, stopOK, uuid } = data;
          findOne.uuid = uuid;
          const arr = (log && log.split(/[\n|\r]/)) || [];
          findOne.value = findOne.value.concat(arr);
          if (stopOK === 'true') {
            // 成功后加载完日志，再次加载不用请求
            findOne.uuid = 'end';
          }
        }
      });
    }
  });
};
const changeInput = () => {
  logDatas.value.forEach((item) => {
    item.value = item.value.reduce((pre, next) => {
      // 先清除所有标记
      const reg = /(<span class="c-mk">)|(<\/span>)/g;
      next = next.replaceAll(reg, '');
      // 再标记搜索项
      if (searchValue.value) {
        const _value = `<span class="c-mk">${searchValue.value}</span>`;
        next = next.replaceAll(searchValue.value, _value);
      }
      pre.push(next);
      return pre;
    }, []);
  });
};
let logDatas = ref([] as LogDataItems[]);
</script>
<template>
  <div class="logs">
    <div class="logs-box common-content-bg-color">
      <div class="logs-box-header">
        <div class="logs-box-header-left">
          <div class="logs-box-header-left-title">{{ name || '--' }}</div>
          <div class="logs-box-header-left-desc">
            <span v-if="totalTime">
              Total time of consuming
              <a>{{ totalTime }}</a>
            </span>
            <span v-else> Building... </span>
          </div>
        </div>
        <div class="logs-box-header-right">
          <el-input v-model="searchValue" :prefix-icon="Search" placeholder="Please input" class="m-b-16" @change="changeInput()"> </el-input>
        </div>
      </div>
      <div class="logs-box-content m-t-24">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="item in logDatas" :key="item.id" :name="item.id">
            <template #title>
              <div class="collapse-title">
                <span class="flex flex-center">
                  <SvgIcon size="normal" :name="statusIconMap[item.status]"></SvgIcon>
                  <span>{{ item.label }}</span>
                </span>
                <span>{{ item.time }}</span>
              </div>
            </template>
            <div class="collapse-content">
              <div v-for="it in item.value" :key="it" v-html="it"></div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/shared/styles/handle.scss';
.logs {
  padding: 40px;
  &-box {
    padding: 24px;
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-left {
        &-title {
          height: 32px;
          font-size: 24px;
          line-height: 32px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        &-desc {
          height: 24px;
          font-size: 16px;
          line-height: 24px;
        }
      }
    }

    &-content {
      padding: 20px 16px;
      min-height: 600px;
      @include background_color('bg-color1');
    }
  }
}

.collapse-title {
  width: 100%;
  display: flex;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
  justify-content: space-between;
}

.collapse-content {
  padding-left: 16px;
  padding-right: 16px;
}
</style>

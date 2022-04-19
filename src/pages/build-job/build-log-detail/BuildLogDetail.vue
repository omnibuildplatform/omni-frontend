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
const statusMap: AnyObj = {
  StepCreated: 'waiting',
  StepRunning: 'running',
  StepSucceed: 'succeed',
  StepFailed: 'failed',
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
const queryJob = () => {
  getJobDetail(id).then((res) => {
    if (res.data) {
      const { data } = res;
      const { steps = [] } = data;
      totalTime.value = calcTime(data);
      if (steps) {
        logDatas.value = steps.map((item: StringObj) => ({
          id: item.id,
          label: item.name,
          time: calcTime(item),
          lock: false,
          status: statusMap[item.state],
          value: [],
        }));
        complete();
      }
      handleChange();
    }
  });
};
if (id) {
  queryJob();
  timer = setInterval(() => {
    queryJob();
  }, 5000);
}
// 请求完成向上冒泡
const percentageParam = reactive({
  percentage: 0,
  status: 'running',
});
const addTime = () => {
  if (percentageParam.percentage < 99) {
    percentageParam.percentage = Math.round(percentageParam.percentage * 10 + 1) / 10;
  }
};
const complete = () => {
  addTime();
  const step = Math.floor(100 / logDatas.value.length);
  logDatas.value.forEach((item, index) => {
    if (item.status === 'running' && percentageParam.percentage < step * index) {
      percentageParam.percentage = step * index;
    }
  });
  if (logDatas.value[logDatas.value.length - 1].status === 'succeed') {
    timer && clearInterval(timer);
    percentageParam.percentage = 100;
    percentageParam.status = 'succeed';
  }
  emit('complete', percentageParam);
};
const totalTime = ref('');
const searchValue = ref('');
const activeNames = ref([]);
const handleChange = () => {
  activeNames.value.forEach((key) => {
    const findOne = logDatas.value.find((it) => key === it.id);
    // 值加载过一遍不用加载第二遍
    if (findOne && !findOne.lock) {
      const params = {
        id,
        stepID: key,
      };
      getJobStepDetail(params).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          const arr = (data && data.split('\n')) || [];
          const _arr = arr.slice(findOne.value.length);
          findOne.value.push(..._arr);
          if (findOne.status === 'succeed') {
            // 成功后加载完日志，再次加载不用请求
            findOne.lock = true;
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
            The total time consuming
            <a>{{ totalTime }}</a>
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

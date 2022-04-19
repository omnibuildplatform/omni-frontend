<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineComponent, onBeforeUnmount, reactive, ref, watch } from 'vue-demi';
import { SuccessRateOption } from '../general/echart-option.config';
import FileSelect from './file-select/FileSelect.vue';
import BuildJobDetail from './build-log-detail/BuildLogDetail.vue';
import { getJobParam } from '@/api/api';
import { AnyObj } from '@/shared/interface/interface';
import { cloneDeep } from 'lodash';
defineComponent({
  FileSelect,
});
const route = useRoute();
// 详情id
const id = (route.params.id || '') as string;
const detail = ref({} as AnyObj);
const defaultPackages = ref([]);
const custom = ref([]);
// 暂时使用假数据展示进度条
const percentage = ref(0);
const successRateOption = reactive(cloneDeep(SuccessRateOption) as AnyObj);
watch(
  () => percentage.value,
  () => initSvg()
);
const initSvg = () => {
  successRateOption.title.text = `${percentage.value}%`;
  successRateOption.series[0].data[0].value = percentage.value;
  successRateOption.series[0].data[1].value = 100 - percentage.value;
};
if (id) {
  getJobParam(id).then((res) => {
    detail.value = res.data || {};
    defaultPackages.value = detail.value?.BasePkg?.split(',') || [];
    custom.value = (detail.value?.CustomPkg && detail.value.CustomPkg.split(',')) || [];

    // 成功状态
    if (detail.value.Status === 'succeed') {
      percentage.value = 100;
    }
  });
}

// 接受到终止信号
const complete = (e: AnyObj) => {
  if (e.percentage === 100 && percentage.value !== 100) {
    getJobParam(id).then((res) => {
      detail.value = res.data || {};
    });
  }
  percentage.value = e.percentage;
};
const download = () => {
  if (detail.value.Status === 'succeed') {
    const a = document.createElement('a');
    a.href = detail.value.DownloadUrl;
    a.download = detail.value.JobLabel || 'download';
    a.click();
    document.body.removeChild(a);
  }
};
</script>
<template>
  <div class="build">
    <div class="build-left">
      <div class="flex flex-center"><OmniEchart id="success_rate_echart" :option="successRateOption" /></div>
      <div class="build-left-btngroup">
        <el-button class="btn" disabled type="primary">Build</el-button>
        <el-button class="btn" disabled type="primary">Stop</el-button>
        <el-button class="btn" :disabled="detail.Status !== 'succeed'" type="primary" @click="download">Download</el-button>
      </div>
      <div class="m-b-24 m-t-24 flex flex-center">
        <el-button disabled class="build-left-downbtn">Download the Configure files</el-button>
      </div>
      <div class="build-left-content">
        <p>
          Name:
          <span>{{ detail.JobLabel || '--' }}</span>
        </p>
        <p>
          Description:
          <span>{{ detail.JobDesc || '--' }}</span>
        </p>
        <p>
          Architecture:
          <span>{{ detail.Arch }}</span>
        </p>
        <p>
          Release Version:
          <span>{{ detail.BuildType }}</span>
        </p>
        <p>
          Output Format Version:
          <span>{{ detail.Release }}</span>
        </p>
        <div v-if="custom.length">
          <p>Custom:</p>
          <FileSelect :options="custom" width="100%" height="100px" columns="1"></FileSelect>
        </div>
        <p>Default:</p>
        <FileSelect :options="defaultPackages" width="100%" height="270px" columns="1"></FileSelect>
      </div>
    </div>
    <div class="build-right">
      <BuildJobDetail :name="detail.JobLabel" @complete="complete($event)"></BuildJobDetail>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/shared/styles/handle.scss';
.build {
  display: grid;
  grid-template-columns: 360px auto;
  &-left {
    padding: 40px 24px;
    @include background_color('bg-color2');
    &-btngroup {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      .btn {
        width: 100px;
      }
    }

    &-downbtn {
      width: 280px;
      height: 48px;
      border: 1px solid;
      @include border_color('bg-color3');
      @include font_color('bg-color3');
    }

    &-content {
      font-size: 14px;
      line-height: 22px;
    }
  }
}
</style>

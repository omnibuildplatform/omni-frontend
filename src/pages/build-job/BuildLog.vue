<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineComponent, ref } from 'vue-demi';
import FileSelect from './file-select/FileSelect.vue';
import BuildJobDetail from './build-log-detail/BuildLogDetail.vue';
import { getJobParam, stopJob } from '@/api/api';
import { AnyObj } from '@/shared/interface/interface';
defineComponent({
  FileSelect,
});
const route = useRoute();
// 详情id
const id = (route.params.id || '') as string;
const fromIso = route?.fullPath?.includes('/build-iso/');
const param = fromIso
  ? {
      jobtype: 'buildimagefromiso',
    }
  : {};
const detail = ref({} as AnyObj);
const defaultPackages = ref([]);
const custom = ref([]);
// 暂时使用假数据展示进度条
const percentage = ref(0);
if (id) {
  getJobParam(id, param).then((res) => {
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
  percentage.value = e.percentage;
  if (e.status && detail.value.Status !== e.status) {
    detail.value.Status = e.status;
  }
  if (e.url) {
    detail.value.DownloadUrl = e.url;
  }
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
const stop = () => {
  stopJob(id, param).then(() => {
    detail.value.Status = 'stopped';
  });
};
const getStatusTitle = (status: string) => {
  return status.slice(0, 1).toLocaleUpperCase() + status.slice(1);
};
</script>
<template>
  <div class="build">
    <div class="build-left">
      <div class="build-left-running">
        <LoopImg :status="detail.Status" />
        <span v-if="['failed', 'stopped'].includes(detail.Status)">{{ getStatusTitle(detail.Status) }}</span>
        <span v-else>{{ percentage + '%' }}</span>
      </div>
      <div class="build-left-btngroup">
        <el-button class="btn" disabled type="primary">Build</el-button>
        <el-button class="btn" :disabled="['succeed', 'failed', 'stopped'].includes(detail.Status)" type="primary" @click="stop">Stop</el-button>
        <el-button class="btn" :disabled="detail.Status !== 'succeed'" type="primary" @click="download">Download</el-button>
      </div>
      <div class="m-b-24 m-t-24 flex flex-center">
        <el-button disabled class="build-left-downbtn">Download the Configure files</el-button>
      </div>
      <div class="build-left-content">
        <p>
          <span class="build-left-content-label">Name:</span>
          <span>{{ detail.JobLabel || '--' }}</span>
        </p>
        <p>
          <span class="build-left-content-label">Description:</span>
          <span>{{ detail.JobDesc || '--' }}</span>
        </p>
        <p>
          <span class="build-left-content-label">Architecture:</span>
          <span>{{ detail.Arch }}</span>
        </p>
        <p>
          <span class="build-left-content-label">Release Version:</span>
          <span>{{ detail.BuildType }}</span>
        </p>
        <p>
          <span class="build-left-content-label">Output Format Version:</span>
          <span>{{ detail.Release }}</span>
        </p>
        <div v-if="custom.length">
          <p class="build-left-content-label">Custom:</p>
          <FileSelect :options="custom" width="100%" height="100px" columns="1"></FileSelect>
        </div>
        <p class="build-left-content-label">Default:</p>
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
    padding: 0px 24px 40px;
    @include background_color('bg-color2');
    &-running {
      position: relative;
      span {
        position: absolute;
        top: 150px;
        left: 0;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        right: 0;
      }
    }
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
      &-label {
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }
}
</style>

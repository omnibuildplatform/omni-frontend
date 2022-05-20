<script setup lang="ts">
import OmniEchart from '@/components/OmniEchart.vue';
import { getPieEchartConfig, SuccessRateOption } from './echart-option.config';
import { useRouter } from 'vue-router';
import { getHistoryList, getHistoryResult } from '@/api/api';
import { reactive, ref } from 'vue';
import { AnyObj, JobStatus } from '@/shared/interface/interface';
import { cloneDeep } from 'lodash';
import { useStoreData } from '@/shared/utils/login';
import { ArrowDown } from '@element-plus/icons-vue';

const router = useRouter();
const successRateOption = reactive(cloneDeep(SuccessRateOption) as AnyObj);
const successOption = reactive(getPieEchartConfig('succeed') as AnyObj);
const failOption = reactive(getPieEchartConfig('failed') as AnyObj);
const stopOption = reactive(getPieEchartConfig('stopped') as AnyObj);
const tableData = ref([]);

const refresh = () => {
  const query = {
    offset: 0,
    limit: 10,
  };
  getHistoryResult().then((res) => {
    const {
      data: { failed = 0, succeed = 0, stopped = 0 },
    } = res;
    successOption.title.text = succeed > 999 ? '999+' : succeed;
    failOption.title.text = failed > 999 ? '999+' : failed;
    stopOption.title.text = stopped > 999 ? '999+' : stopped;
    // 成功率计算
    const total = failed + succeed + stopped;
    if (total) {
      successRateOption.title.text = `${Math.round((succeed * 10000) / total) / 100}%`;
      successRateOption.series[0].data[0].value = succeed;
      successRateOption.series[0].data[1].value = failed + stopped;
    } else {
      successRateOption.title.text = 0;
      successRateOption.series[0].data[0].value = 0;
      successRateOption.series[0].data[1].value = 1;
    }
  });
  getHistoryList(query).then((data) => {
    tableData.value = data.data || [];
  });
};
refresh();
const goToRealese = () => {
  router.push('/control/build-job');
};
const goToISO = () => {
  router.push('/control/build-iso');
};
const jumpToJobList = (type: JobStatus) => {
  const { statusToJobList } = useStoreData();
  statusToJobList.value = type;
  router.push('/control/job-list');
};
</script>
<template>
  <div class="general">
    <div class="general-header">
      <div class="general-header-card">
        <OmniEchart id="success_rate_echart" :option="successRateOption" />
        <span>Success Rate</span>
      </div>
      <div class="general-header-card middle-card">
        <OmniEchart id="success_echart" :option="successOption" @click="jumpToJobList('succeed')" />
        <span>Successed</span>
      </div>
      <div class="general-header-card middle-card">
        <OmniEchart id="failed_echart" :option="failOption" @click="jumpToJobList('failed')" />
        <span>Failed</span>
      </div>
      <div class="general-header-card middle-card">
        <OmniEchart id="stopped_echart" :option="stopOption" @click="jumpToJobList('stopped')" />
        <span>Stopped</span>
      </div>
    </div>
    <div class="m-t-40 general-neck">
      <el-dropdown>
        <el-button type="primary" class="general-neck-btn text-center">
          新建任务<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goToISO()">Image from ISO</el-dropdown-item>
            <el-dropdown-item @click="goToRealese()">Image from Realese</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="m-t-40 m-b-24 general-body">
      <p class="m-b-16 general-body-title">最近任务</p>
      <div class="general-body-table">
        <JobListTable :table-data="tableData" @refresh-table="refresh"></JobListTable>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import '../../shared/styles/handle';
.general {
  width: 100%;
  margin-top: 64px;
  .general-header {
    display: flex;
    justify-content: center;
    .general-header-card {
      width: 360px;
      height: 297px;
      @include background_color('bg-color2');
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      @include font_color('font-color1');
      span {
        margin-top: 16px;
      }
    }
    .middle-card {
      margin-left: 24px;
    }
  }

  .general-neck {
    display: flex;
    justify-content: center;
    .general-neck-btn {
      font-size: 16px;
      width: 144px;
      height: 48px;
    }
  }

  .general-body {
    padding-left: 96px;
    padding-right: 96px;
    &-title {
      font-size: 24px;
      line-height: 32px;
      font-weight: bold;
    }
    &-table {
      :deep(.el-table th.el-table__cell) {
        background-color: #e5e8f0;
      }
    }
  }
}
</style>

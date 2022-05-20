<script setup lang="ts">
import { useRouter } from 'vue-router';
import { statusIconMap } from '@/shared/utils/map.const';
import { computed, ref } from 'vue';
import { deleteJob } from '@/api/api';
import { AnyObj, JobListfilterConfig, JobListFilterType, JobStatus } from '@/shared/interface/interface';
import { useStoreData } from '@/shared/utils/login';
import TableTag from './TableTag.vue';
import DialogModal from './DialogModal.vue';
import { dateFormat } from '../shared/utils/common';
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  model: {
    type: String,
    default: 'simple',
  },
});
const dialog = ref<null | AnyObj>(null);

// 表格过滤内容
const tabFilterObj = ref({
  status: [],
  type: [],
  arch: [],
} as JobListfilterConfig);
const getDefalutFilter = () => {
  // 跳转过滤展示
  const { statusToJobList } = useStoreData();
  if (statusToJobList.value) {
    tabFilterObj.value.status = [statusToJobList.value];
    statusToJobList.value = '';
    emit('refreshTable', tabFilterObj.value);
  }
};
getDefalutFilter();
const filterHandler = (filter: JobListfilterConfig) => {
  Object.keys(filter).forEach((item) => {
    tabFilterObj.value[item as JobListFilterType] = filter[item as JobListFilterType];
  });
  emit('refreshTable', tabFilterObj.value);
};
const statusFilter = computed(() =>
  props.model === 'simple'
    ? null
    : Object.keys(statusIconMap).map((key) => ({
        text: key,
        value: key,
      }))
);
const buildTypeFilter = computed(() =>
  props.model === 'simple'
    ? null
    : [
        { text: 'installer-iso', value: 'installer-iso' },
        { text: 'vhd', value: 'vhd' },
        { text: 'qcow2', value: 'qcow2' },
        { text: 'raw', value: 'raw' },
      ]
);
const archFilter = computed(() =>
  props.model === 'simple'
    ? null
    : [
        { text: 'x86_64', value: 'x86_64' },
        { text: 'VRM', value: 'VRM' },
        { text: 'MIPS', value: 'MIPS' },
        { text: 'POWER', value: 'POWER' },
        { text: 'ALPHA', value: 'ALPHA' },
        { text: 'Z80', value: 'Z80' },
      ]
);
const getHelpTips = (status: string) => {
  if (['waiting', 'running'].includes(status)) {
    return 'The job is not completed, please wait';
  }
  return 'The job has failed or stopped. Click 【Rebuild】 to rebuild';
};
const router = useRouter();
const viewDetail = (data: AnyObj) => {
  if (data?.JobType === 'buildimagefromiso') {
    router.push(`/control/build-iso/build-log/${data.JobName}`);
  } else {
    router.push(`/control/build-job/build-log/${data.JobName}`);
  }
};
const openReBuild = (data: AnyObj) => {
  dialog?.value?.open({
    content: 'Click 【Rebuild】 to rebuild a new job. You can either keep the original build parameters or reconfigure the build parameters.',
    callback: () => reBuild(data),
  });
};
const reBuild = (data: AnyObj) => {
  if (data?.JobType === 'buildimagefromiso') {
    router.push(`/control/build-iso/${data.JobName}`);
  } else {
    router.push(`/control/build-job/${data.JobName}`);
  }
};
const openDeletejob = (id: string) => {
  dialog?.value?.open({
    content: 'Clicking 【delete】 will delete this build job and its successfully built image file. Are you sure you want to delete this job?',
    callback: () => deletejob(id),
  });
};
const deletejob = (id: string) => {
  deleteJob([id]).then(() => {
    emit('refreshTable', tabFilterObj.value);
  });
};
const handleSelectionChange = (data: any[]) => {
  emit('selectionChange', data);
};
const emit = defineEmits(['refreshTable', 'selectionChange']);
const getSvgName = (status: JobStatus) => {
  return statusIconMap[status];
};
const update = (e: AnyObj[]) => {
  if (e) {
    e.forEach((item) => {
      tabFilterObj.value[item.key as JobListFilterType]?.splice(0);
    });
  }
  emit('refreshTable', tabFilterObj.value);
};
const tableCol = {
  status: {
    key: 'status',
    label: 'Status',
  },
  type: {
    key: 'type',
    label: 'Type',
  },
  arch: {
    key: 'arch',
    label: 'Architecture',
  },
};
</script>
<template>
  <DialogModal ref="dialog"></DialogModal>
  <TableTag :table-col="tableCol" :model-value="tabFilterObj" @update:model-value="update($event)"></TableTag>
  <el-table :data="tableData" style="width: 100%" @filter-change="filterHandler" @selection-change="handleSelectionChange">
    <el-table-column v-if="model !== 'simple'" type="selection" width="55" />
    <el-table-column
      column-key="status"
      :filters="statusFilter"
      filter-placement="bottom"
      :filter-multiple="false"
      :filtered-value="tabFilterObj.status"
      label="Status"
      width="85"
    >
      <template #default="scope">
        <SvgIcon class="tab-status-icon" :name="getSvgName(scope.row.Status)"></SvgIcon>
      </template>
    </el-table-column>
    <el-table-column
      column-key="type"
      show-overflow-tooltip
      :filters="buildTypeFilter"
      :filter-multiple="false"
      filter-placement="bottom"
      :filtered-value="tabFilterObj.type"
      prop="BuildType"
      label="Type"
      width="120"
    />
    <el-table-column
      column-key="arch"
      show-overflow-tooltip
      :filters="archFilter"
      :filter-multiple="false"
      filter-placement="bottom"
      :filtered-value="tabFilterObj.arch"
      prop="Arch"
      label="Architecture"
      width="130"
    />
    <el-table-column show-overflow-tooltip prop="JobName" label="ID" />
    <el-table-column show-overflow-tooltip prop="JobLabel" label="Name" />
    <el-table-column show-overflow-tooltip prop="JobDesc" label="Description" />
    <el-table-column show-overflow-tooltip prop="CreateTime" label="Create Time">
      <template #default="scope">
        <span>{{ dateFormat(scope.row.CreateTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Operate">
      <template #default="scope">
        <div>
          <a class="app-text-btn build-btn" @click="openReBuild(scope.row)">rebuild</a>
          <a class="app-text-btn" @click="openDeletejob(scope.row.JobName)">delete</a>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Download">
      <template #default="scope">
        <div>
          <a v-if="scope.row.Status === 'succeed'" :href="scope.row.DownloadUrl" class="app-text-btn" download="file">Download</a>
          <span v-else>
            <span class="app-disable-text-btn">Download</span>
            <el-tooltip placement="top" :content="getHelpTips(scope.row.Status)">
              <SvgIcon class="tab-status-icon help-tips" name="help"></SvgIcon>
            </el-tooltip>
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Detail">
      <template #default="scope">
        <div>
          <a class="app-text-btn" @click="viewDetail(scope.row)">View detail</a>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<style scoped lang="scss">
.tab-status-icon {
  width: 20px;
  height: 20px;
}
:deep(.el-table__column-filter-trigger) {
  .el-icon {
    display: none;
  }

  width: 16px;
  height: 16px;
  background-image: url(../assets/svg-icons/filter.svg);
  position: relative;
  top: 3px;
  left: 3px;
}
.build-btn {
  margin-right: 16px;
}
.help-tips {
  margin-left: 4px;
  cursor: pointer;
}
</style>

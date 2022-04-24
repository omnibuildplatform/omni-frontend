<script setup lang="ts">
import { useRouter } from 'vue-router';
import { statusIconMap } from '@/shared/utils/map.const';
import { computed, ref } from 'vue';
import { deleteJob } from '@/api/api';
import { JobListfilterConfig, JobListFilterType, JobStatus } from '@/shared/interface/interface';
import { useStoreData } from '@/shared/utils/login';
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

// 表格过滤内容
const tabFilterObj = ref({
  status: [],
  arch: [],
  type: [],
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
const rebuildVisible = ref(false);
const deleteVisible = ref(false);
// modal弹窗使用的id
const modalJobname = ref('');
const router = useRouter();
const viewDetail = (id: string) => {
  router.push(`/control/build-image/build-log/${id}`);
};
const openReBuild = (id: string) => {
  modalJobname.value = id;
  rebuildVisible.value = true;
};
const reBuild = (id: string) => {
  router.push(`/control/build-image/build-job/${id}`);
};
const openDeletejob = (id: string) => {
  modalJobname.value = id;
  deleteVisible.value = true;
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
</script>
<template>
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
    <el-table-column show-overflow-tooltip prop="CreateTime" label="Create Time" />
    <el-table-column label="Operate">
      <template #default="scope">
        <div>
          <a class="app-text-btn build-btn" @click="openReBuild(scope.row.JobName)">rebuild</a>
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
          <a class="app-text-btn" @click="viewDetail(scope.row.JobName)">View detail</a>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="rebuildVisible" title="Tips" width="30%" draggable center>
    <span>Click 【Rebuild】 to rebuild a new job. You can either keep the original build parameters or reconfigure the build parameters.</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="
            rebuildVisible = false;
            reBuild(modalJobname);
          "
          >Confirm
        </el-button>
        <el-button
          @click="
            rebuildVisible = false;
            modalJobname = '';
          "
          >Cancel</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="deleteVisible" title="Tips" width="30%" draggable center>
    <span>Clicking 【delete】 will delete this build job and its successfully built image file. Are you sure you want to delete this job?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="
            deleteVisible = false;
            deletejob(modalJobname);
          "
          >Confirm</el-button
        >
        <el-button
          @click="
            deleteVisible = false;
            modalJobname = '';
          "
          >Cancel
        </el-button>
      </span>
    </template>
  </el-dialog>
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

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { statusIconMap } from '@/shared/utils/map.const';
import { computed } from 'vue';
import { deleteJob } from '@/api/api';
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
const buildTypeFilter = computed(() =>
  props.model === 'simple'
    ? null
    : [
        { text: 'iso', value: 'iso' },
        { text: 'vhd', value: 'vhd' },
        { text: 'qcow2', value: 'qcow2' },
        { text: 'raw', value: 'raw' },
      ]
);
const archFilter = computed(() =>
  props.model === 'simple'
    ? null
    : [
        { text: 'X86', value: 'X86' },
        { text: 'VRM', value: 'VRM' },
        { text: 'MIPS', value: 'MIPS' },
        { text: 'POWER', value: 'POWER' },
        { text: 'ALPHA', value: 'ALPHA' },
        { text: 'Z80', value: 'Z80' },
      ]
);
const router = useRouter();
const viewDetail = (id: string) => {
  router.push(`/control/build-image/build-log/${id}`);
};
const reBuild = (id: string) => {
  router.push(`/control/build-image/build-job/${id}`);
};
const deletejob = (id: string) => {
  deleteJob(id).then((data) => {
    data;
  });
};
</script>
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column v-if="model !== 'simple'" type="selection" width="55" />
    <el-table-column label="Status">
      <template #default="scope">
        <SvgIcon class="tab-status-icon" :name="statusIconMap[scope.row.Status]"></SvgIcon>
      </template>
    </el-table-column>
    <el-table-column :filters="buildTypeFilter" prop="BuildType" label="Type" />
    <el-table-column :filters="archFilter" prop="Arch" label="Architecture" />
    <el-table-column show-overflow-tooltip prop="JobName" label="ID" />
    <el-table-column show-overflow-tooltip prop="JobLabel" label="Name" />
    <el-table-column show-overflow-tooltip prop="JobDesc" label="Description" />
    <el-table-column show-overflow-tooltip prop="CreateTime" label="Last Duration" />
    <el-table-column label="Operate">
      <template #default="scope">
        <div>
          <a class="app-text-btn build-btn" @click="reBuild(scope.row.JobName)">rebuild</a>
          <a class="app-text-btn" @click="deletejob(scope.row.JobName)">delete</a>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Download">
      <template #default="scope">
        <div>
          <a v-if="scope.row.Status === 'succeed'" :href="scope.row.DownloadUrl" class="app-text-btn" download="file">Download</a>
          <span v-else class="app-disable-text-btn">Download</span>
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
</style>

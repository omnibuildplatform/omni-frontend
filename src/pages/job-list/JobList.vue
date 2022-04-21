<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { deleteJob, getHistoryList } from '@/api/api';
import { StringObj } from '@/shared/interface/interface';
const tableData = ref([]);
const refresh = () => {
  const query = {
    offset: 0,
    limit: 100,
  };
  getHistoryList(query).then((data) => {
    tableData.value = data.data || [];
  });
};
refresh();
const searchValue = ref('');
const selectCol = ref([] as StringObj[]);
const selectionChange = (evt: StringObj[]) => {
  selectCol.value = evt;
};
const deleteVisible = ref(false);
const deleteAll = () => {
  if (selectCol.value.length) {
    const ids = selectCol.value.map((item) => item?.JobName);
    deleteJob(ids).then(() => {
      refresh();
    });
  }
};
const openDeleteModal = () => {
  if (selectCol.value.length) {
    deleteVisible.value = true;
  }
}
</script>
<template>
  <div class="job">
    <div class="job-header">
      <el-input v-model="searchValue" class="job-header-search" placeholder="Search" :prefix-icon="Search" />
    </div>
    <div class="job-neck">
      <span class="flex flex-center" :class="selectCol.length ? 'app-text-btn' : 'app-disable-text-btn'" @click="openDeleteModal">
        <SvgIcon class="job-neck-icon" name="remove"></SvgIcon>
        <span>delete</span>
      </span>
    </div>
    <JobListTable model="complex" :table-data="tableData" @refresh-table="refresh" @selection-change="selectionChange($event)"></JobListTable>
  </div>
  <el-dialog v-model="deleteVisible" title="Tips" width="30%" draggable center>
    <span>Clicking 【delete】 will delete this build jobs and its successfully built image files. Are you sure you want to delete this jobs?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="
            deleteVisible = false;
            deleteAll();
          "
          >Confirm</el-button
        >
        <el-button @click="deleteVisible = false">Cancel </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.job {
  padding-top: 64px;
  padding-left: 96px;
  padding-right: 96px;
  &-header {
    display: flex;
    justify-content: right;
    &-search {
      width: 400px;
    }
  }
  &-neck {
    display: flex;
    align-items: center;
    justify-content: right;
    margin-top: 24px;
    margin-bottom: 24px;
    margin-right: 24px;
    &-icon {
      margin-right: 4px;
    }
  }
}
</style>

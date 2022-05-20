<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { deleteJob, getHistoryList } from '@/api/api';
import { AnyObj, JobListfilterConfig, JobListFilterType, StringObj } from '@/shared/interface/interface';
const tableData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  refresh();
};
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  refresh();
};
let filter = {} as JobListfilterConfig;
const filterTab = (filters: JobListfilterConfig) => {
  filter = filters;
  refresh();
};
const searchValue = ref('');
const changeInput = () => {
  refresh();
};
const refresh = () => {
  const filterParam: AnyObj = {};
  if (filter) {
    Object.keys(filter).reduce((pre, next) => {
      if (filter[next as JobListFilterType].length) {
        pre[next] = filter[next as JobListFilterType][0];
      }
      return pre;
    }, filterParam);
  }
  const query = {
    offset: (currentPage.value - 1) * pageSize.value,
    limit: pageSize.value,
    nameordesc: searchValue.value,
    ...filterParam,
  };
  getHistoryList(query).then((data) => {
    tableData.value = data.data || [];
    total.value = data.attach || 0;
  });
};
refresh();
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
};
</script>
<template>
  <div class="job">
    <div class="job-header">
      <el-input v-model="searchValue" class="job-header-search" placeholder="Search" :prefix-icon="Search" @change="changeInput()" />
    </div>
    <div class="job-neck">
      <span class="flex flex-center" :class="selectCol.length ? 'app-text-btn' : 'app-disable-text-btn'" @click="openDeleteModal">
        <SvgIcon class="job-neck-icon" name="remove"></SvgIcon>
        <span>delete</span>
      </span>
    </div>
    <JobListTable model="complex" :table-data="tableData" @refresh-table="filterTab($event)" @selection-change="selectionChange($event)"></JobListTable>
    <div class="flex flex-center pagination">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
.pagination {
  margin: 24px auto;
}
</style>

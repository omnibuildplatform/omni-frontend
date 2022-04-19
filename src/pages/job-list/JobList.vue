<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { getHistoryList } from '@/api/api';
const tableData = ref([]);
const query = {
  offset: 0,
  limit: 100,
};
getHistoryList(query).then((data) => {
  tableData.value = data.data || [];
});
const searchValue = ref('');
</script>
<template>
  <div class="job">
    <div class="job-header">
      <el-input v-model="searchValue" class="job-header-search" placeholder="Search" :prefix-icon="Search" />
    </div>
    <div class="job-neck">
      <SvgIcon class="app-text-btn job-neck-icon" name="remove"></SvgIcon>
      <div class="app-text-btn">delete</div>
    </div>

    <JobListTable model="complex" :table-data="tableData"></JobListTable>
  </div>
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

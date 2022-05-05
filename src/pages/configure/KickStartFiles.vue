<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');
const desc = ref('');
const browse = ref('');
const tableData = ref([]);
const importFiles = () => {
  name;
};
const viewFile = (data: string) => {
  data;
};
const editFile = (data: string) => {
  data;
};
const deleteFile = (data: string) => {
  data;
};
</script>

<template>
  <div class="main">
    <h3 class="main-header m-b-24">KickStartFiles</h3>
    <div class="main-body common-content-bg-color">
      <div class="main-body-create">
        <span>Name</span>
        <div class="main-body-create-input">
          <el-input v-model="name" maxlength="64" placeholder="Please input" />
        </div>
        <span>Description</span>
        <div class="main-body-create-input">
          <el-input v-model="desc" maxlength="64" placeholder="Please input" />
        </div>
        <span>Browse</span>
        <div class="main-body-create-input">
          <el-input v-model="browse" maxlength="64" placeholder="Please input" />
        </div>
        <el-button type="primary" @click="importFiles()">Import Files</el-button>
      </div>
      <div class="main-body-table m-t-40 m-b-24">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column show-overflow-tooltip prop="JobName" label="ID" />
          <el-table-column show-overflow-tooltip prop="JobLabel" label="Name" />
          <el-table-column show-overflow-tooltip prop="JobDesc" label="Description" />
          <el-table-column show-overflow-tooltip prop="CreateTime" label="Created At" />
          <el-table-column show-overflow-tooltip prop="CreateTime" label="Updated At" />
          <el-table-column label="Operate">
            <template #default="scope">
              <div>
                <a class="app-text-btn build-btn" @click="viewFile(scope.row.JobName)">View</a>
                <a class="app-text-btn" @click="editFile(scope.row.JobName)">Edit</a>
                <a class="app-text-btn" @click="deleteFile(scope.row.JobName)">Delete</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-body-editer">
        <EditorComponent />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  padding: 40px 96px;
  &-header {
    height: 32px;
    font-size: 24px;
    line-height: 32px;
  }
  &-body {
    padding: 40px;
    &-create {
      display: flex;
      align-items: center;
      font-size: 18px;
      &-input {
        width: 168px;
        margin-left: 24px;
        margin-right: 24px;
      }
    }
  }
}
</style>

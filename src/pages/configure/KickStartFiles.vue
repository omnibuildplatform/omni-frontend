<script setup lang="ts">
import { computed, ref } from 'vue';
import { genFileId, UploadFile } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import { getUserAuth } from '@/shared/utils/login';
import { getKickStartList, updateKickStart } from '@/api/api';
import { AnyObj } from '@/shared/interface/interface';

const upData = ref({
  name: '',
  desc: '',
});
const browse = ref('');
const tableData = ref([]);
const editor = ref<null | AnyObj>(null);
// 上传文件接口
const action = `${window.location.origin}/api/v3/kickStart/add`;
// 使用token
const { token } = getUserAuth();
const headers = {
  Authorization: token,
};
// 编辑框数据
const editData = ref({
  data: '',
  id: '',
});
const upload = ref<UploadInstance>();

// 获取列表数据
const getTableList = () => {
  const query = {
    offset: 0,
    limit: 10,
  };
  getKickStartList(query).then((data) => {
    tableData.value = data?.data || [];
  });
};
getTableList();
const importFiles = () => {
  upload.value?.submit();
};
const editFile = (data: AnyObj) => {
  const res = editor?.value?.save();
  if (res.id) {
    // 点击多个edit，保存上一次edit的Content
    tableData.value.forEach((item: AnyObj) => {
      if (item.ID === res.id) {
        item.Content = res.data;
      }
    });
  }
  editData.value.data = data.Content;
  editData.value.id = data.ID;
  data.edit = true;
};

// 清空编辑框数据
const clearEditData = () => {
  editData.value.data = '';
  editData.value.id = '';
};
const save = (data: AnyObj) => {
  // name与desc不能为空否则不能保存
  if (data.Name && data.Desc) {
    const res = editor?.value?.save();
    const content = res.id === data.ID ? res.data : data.Content;
    const param = {
      id: data.ID,
      content,
      name: data.Name,
      desc: data.Desc,
    };
    updateKickStart(param).then(() => {
      data.edit = false;
    });
  }
};
const deleteFile = (data: string) => {
  data;
};
const disableBtn = computed(() => {
  return !Boolean(upData.value.desc && upData.value.name && browse.value);
});
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value?.handleStart(file);
};
const handleChange = (files: UploadFile) => {
  if (files?.name) {
    const arr = files.name.split('.');
    const suffix = arr[arr.length - 1];
    if (['cfg'].includes(suffix)) {
      browse.value = files?.name || '';
    } else {
      browse.value = '';
      upload.value?.clearFiles();
    }
  }
};
</script>

<template>
  <div class="main">
    <h3 class="main-header m-b-24">KickStartFiles</h3>
    <div class="main-body common-content-bg-color">
      <div class="main-body-create">
        <span>Name</span>
        <div class="main-body-create-input">
          <el-input v-model="upData.name" maxlength="64" placeholder="Please input" />
        </div>
        <span>Description</span>
        <div class="main-body-create-input">
          <el-input v-model="upData.desc" maxlength="512" placeholder="Please input" />
        </div>
        <span>Browse</span>
        <el-upload
          ref="upload"
          class="main-body-create-input"
          :action="action"
          :headers="headers"
          :limit="1"
          :show-file-list="false"
          :data="upData"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :auto-upload="false"
        >
          <template #trigger>
            <el-input v-model="browse" placeholder="Select cfg file" readonly />
          </template>
        </el-upload>
        <el-button class="main-body-create-btn" type="primary" :disabled="disableBtn" @click="importFiles()">Import Files</el-button>
      </div>
      <div class="main-body-table m-t-40 m-b-24">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column show-overflow-tooltip prop="ID" label="ID"></el-table-column>
          <el-table-column show-overflow-tooltip prop="Name" label="Name">
            <template #default="scope">
              <el-input v-if="scope.row.edit" v-model="scope.row.Name" maxlength="64" placeholder="Please input" />
              <span v-else>{{ scope.row.Name }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="Desc" label="Description">
            <template #default="scope">
              <el-input v-if="scope.row.edit" v-model="scope.row.Desc" maxlength="64" placeholder="Please input" />
              <span v-else>{{ scope.row.Desc }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="CreateTime" label="Created At" />
          <el-table-column show-overflow-tooltip prop="UpdateTime" label="Updated At" />
          <el-table-column label="Operate">
            <template #default="scope">
              <div class="operate">
                <a
                  v-if="scope.row.edit"
                  class="m-r-16"
                  :class="scope.row.Desc && scope.row.Name ? 'app-text-btn' : 'app-disable-text-btn'"
                  @click="save(scope.row)"
                >
                  Save
                </a>
                <a v-else class="app-text-btn m-r-16" @click="editFile(scope.row)">Edit</a>
                <a class="app-text-btn" @click="deleteFile(scope.row.ID)">Delete</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-body-editer">
        <EditorComponent :id="editData.id" ref="editor" :data="editData.data" />
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
      &-btn {
        margin-left: 16px;
      }
    }
  }
  .operate {
    line-height: 32px;
  }
}
</style>

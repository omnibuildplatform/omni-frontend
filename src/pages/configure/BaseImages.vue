<script setup lang="ts">
import { ref, computed } from 'vue';
import { getbaseImagesList, updatebaseImages, deletebaseImages, postbaseImages } from '@/api/api';
import { AnyObj } from '@/shared/interface/interface';
import { Refresh } from '@element-plus/icons-vue';
const dialog = ref<null | AnyObj>(null);
const upData = ref({
  name: '',
  desc: '',
  arch: '',
  checksum: '',
  url: '',
});

const total = ref(0);
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);

const editImg = (data: AnyObj) => {
  data.edit = true;
};
const save = (data: AnyObj) => {
  // name,desc与arch不能为空否则不能保存
  if (data.Name && data.Desc && data.Arch && data.Checksum) {
    const param = {
      id: data.ID,
      Name: data.Name,
      Desc: data.Desc,
      Arch: data.Arch,
      Checksum: data.Checksum,
    };
    updatebaseImages(param).then(() => {
      data.edit = false;
    });
  }
};
// 获取列表数据
const getTableList = () => {
  const query = {
    offset: (currentPage.value - 1) * pageSize.value,
    limit: pageSize.value,
  };
  getbaseImagesList(query).then((data) => {
    tableData.value = data?.data || [];
    total.value = data.attach;
  });
};
getTableList();
// 在表中新增数据
const importImages = () => {
  postbaseImages(upData.value).then(() => {
    getTableList();
    upData.value.name = '';
    upData.value.arch = '';
    upData.value.desc = '';
    upData.value.url = '';
    upData.value.checksum = '';
  });
};
const refreshData = () => {
  getTableList();
};
const openDelete = (data: string) => {
  dialog?.value?.open({
    content: 'Are you sure you want to delete this data?',
    callback: () => deleteImg(data),
  });
};
const deleteImg = (data: string) => {
  deletebaseImages(data).then(() => {
    getTableList();
  });
};

const disableBtn = computed(() => {
  return !Boolean(upData.value.desc && upData.value.name && upData.value.arch && upData.value.checksum && upData.value.url);
});
// 分页器
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  getTableList();
};
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  getTableList();
};
// Arch选项
const options = [
  {
    value: 'x86_64',
    label: 'x86_64',
  },
];
</script>

<template>
  <DialogModal ref="dialog"></DialogModal>
  <div class="main">
    <h3 class="main-header m-b-24">Base Images</h3>
    <div class="main-body common-content-bg-color">
      <div class="main-body-create">
        <span>Name</span>
        <div class="main-body-create-input">
          <el-input v-model="upData.name" maxlength="64" placeholder="Please input" />
        </div>
        <span>Desc</span>
        <div class="main-body-create-input">
          <el-input v-model="upData.desc" maxlength="512" placeholder="Please input" />
        </div>
        <span>Checksum</span>
        <div class="main-body-create-input">
          <el-input v-model="upData.checksum" maxlength="256" placeholder="Please input SHA-256" />
        </div>
        <span>Url</span>
        <div class="main-body-create-input">
          <el-input v-model="upData.url" maxlength="128" placeholder="Please input" />
        </div>
        <span>Arch</span>
        <div class="main-body-create-input">
          <el-select v-model="upData.arch" placeholder="Please select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <el-button type="primary" :disabled="disableBtn" @click="importImages()">Import Images</el-button>
      </div>
      <div class="main-body-table m-t-16 m-b-24">
        <div class="main-body-table-btn">
          <el-icon :size="25" @click="refreshData()">
            <refresh class="app-text-btn" />
          </el-icon>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column show-overflow-tooltip prop="ID" label="ID" />
          <el-table-column show-overflow-tooltip prop="Status" label="Status" />
          <el-table-column show-overflow-tooltip prop="Name" label="Name"
            ><template #default="scope">
              <el-input v-if="scope.row.edit" v-model="scope.row.Name"> </el-input>
              <span v-else>{{ scope.row.Name }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="Desc" label="Description">
            <template #default="scope">
              <el-input v-if="scope.row.edit" v-model="scope.row.Desc"> </el-input>
              <span v-else>{{ scope.row.Desc }}</span>
            </template></el-table-column
          >
          <el-table-column show-overflow-tooltip prop="Arch" label="Architecture"
            ><template #default="scope">
              <el-select v-if="scope.row.edit" v-model="scope.row.Arch">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option
              ></el-select>
              <span v-else>{{ scope.row.Arch }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="Checksum" label="Checksum" />
          <el-table-column label="Operation" width="158">
            <template #default="scope">
              <div class="operate">
                <a
                  v-if="scope.row.edit"
                  class="m-r-8"
                  :class="scope.row.Desc && scope.row.Name && scope.row.Arch ? 'app-text-btn' : 'app-disable-text-btn'"
                  @click="save(scope.row)"
                >
                  Save
                </a>
                <a v-else class="app-text-btn m-r-8" @click="editImg(scope.row)">Edit</a>
                <a class="app-text-btn" @click="openDelete(scope.row.ID)">Delete</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="flex flex-center m-t-24">
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
    &-table {
      &-btn {
        text-align: right;
        padding-bottom: 8px;

        .app-text-btn {
          border: 1px solid #adada5;
        }
      }
    }
  }
  .operate {
    line-height: 32px;
  }
}
</style>

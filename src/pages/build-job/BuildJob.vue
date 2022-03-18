<script setup lang="ts">
import { reactive, ref } from 'vue';
import { queryProductData, startBuild } from '@/api/api';
import { useCounter } from '@/stores/counter';
import { defineComponent } from 'vue-demi';
import ProductSelect from './product-select/ProductSelect.vue';
import FileSelect from './file-select/FileSelect.vue';
import { AnyObj } from '@/shared/interface/interface';

const counter = useCounter();

defineComponent({
  ProductSelect,
  FileSelect,
});
const selectArr = reactive([
  {
    id: 'packages',
    name: 'Architecture',
    data: [],
    value: '',
  },
  {
    id: 'version',
    name: 'Release Version',
    data: [],
    value: '',
  },
  {
    id: 'buildType',
    name: 'Output Format',
    data: [],
    value: '',
  },
]);
let defaultPackages = ref([]);
queryProductData().then((res) => {
  const {
    attach: { packages = [] },
    data,
  } = res;
  defaultPackages.value = packages;
  selectArr.forEach((item) => {
    const pre = data[item.id];
    item.data = pre;
    item.value = pre[0];
  });
});

const changeData = (e: string, type: string) => {
  selectArr.forEach((item) => {
    if (item.id === type) {
      item.value = e;
    }
  });
};

const disabledBuildBtn = ref(false);
const build = () => {
  const data: AnyObj = {
    packages: '',
    version: '',
    buildType: '',
    customPkg: [],
  };
  selectArr.forEach((item) => {
    data[item.id] = item.value;
  });
  startBuild(data).then((res: AnyObj) => {
    createWSData(res);
  });
};

const wsData: string[] = reactive([]);

// 创建wbsocket长链接，监控日志
const createWSData = (res: AnyObj) => {
  const {
    data,
    attach: { host, port },
    title,
  } = res;
  disabledBuildBtn.value = true;
  const url = `ws://${host}:${port}/wsQueryJobStatus?token=tokentest&jobname=${data}&jobDBID=${title}`;
  const ws = new WebSocket(url);
  ws.onclose = () => {
    disabledBuildBtn.value = false;
    wsData.push('Connection closed');
    scrollBottom();
  };
  ws.onmessage = (evt) => {
    wsData.push(evt.data);
    scrollBottom();
  };
};

const scrollBottom = () => {
  const dom = document.getElementById('log_contain') || ({} as HTMLElement);
  const { scrollHeight } = dom;
  dom.scrollTop = scrollHeight;
};

const group = ['deve'];

const custom: string[] = [];
</script>
<template>
  <div class="body">
    <div class="left-main">
      <div v-for="selectItem in selectArr" :key="selectItem.name" class="select">
        <ProductSelect
          :value="selectItem.value"
          :title="selectItem.name"
          :options="selectItem.data"
          @change-data="changeData($event, selectItem.id)"
        ></ProductSelect>
      </div>
      <div>
        <p>default</p>
        <FileSelect :options="defaultPackages" width="500px"></FileSelect>
      </div>
      <div class="change">
        <div class="left">
          <p>Custom</p>
          <FileSelect :options="custom" height="192px" width="192px"></FileSelect>
        </div>
        <div class="mid">
          <el-button class="remove-btn" size="large" type="primary">remove</el-button>
          <el-button size="large" type="primary">add</el-button>
        </div>
        <div class="ritht">
          <ProductSelect title="Group" :options="group"></ProductSelect>
          <FileSelect :options="custom" width="192px"></FileSelect>
        </div>
      </div>
    </div>
    <div class="right-main">
      <h3>Log:</h3>
      <div id="log_contain" class="log-contain">
        <div v-for="log in wsData" :key="log" class="select">
          <p>{{ log }}</p>
        </div>
      </div>
    </div>
  </div>
  <footer class="footer">
    <el-button size="large" type="primary" :disabled="disabledBuildBtn" @click="build">build</el-button>
  </footer>
</template>
<style lang="scss" scoped>
.body {
  display: flex;
  .left-main {
    width: 50%;
  }
  .right-main {
    width: 50%;
  }
}
.log-contain {
  height: 600px;
  width: 100%;
  overflow-y: auto;
  border: 1px solid #282b33;
}
.select {
  margin-bottom: 16px;
}
.change {
  display: flex;
  width: 500px;
  margin-top: 16px;
  .mid {
    padding-right: 12px;
    .remove-btn {
      margin-left: 12px;
      margin-top: 48px;
      margin-bottom: 12px;
    }
    button {
      width: 80px;
    }
  }
}
.footer {
  margin-top: 24px;
  padding-top: 12px;
  display: flex;
  justify-content: center;
  border-top: 1px dotted #282b33;
}
</style>

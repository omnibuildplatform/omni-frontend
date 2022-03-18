# vue3-ts-starter

### 介绍
vue3模板库, 使用vite构建，并集成Scss + Vue Router + Pinia + Axios

### 软件架构
Vue 3 + TypeScript + Vite + Scss + Vue Router + Pinia + Axios

### 安装教程
1. 推荐使用[pnpm](https://pnpm.io/installation)安装，当前你也可以使用npm、yarn
2. 安装依赖 ```pnpm install```
3. 运行项目 ```pnpm dev```


### 风格命名
1. 文件夹名称建议使用kebab-case, 如： hello-world
2. vue文件建议使用PascalCase, 如： HelloWorld.vue

### 目录说明
```
|-- src

  |-- api API接口

  |-- assets 资源目录，如图片、视频等
      |-- svg-icons  svg 雪碧图图标

  |-- components 跨页面公共组件

  |-- pages 项目页面
      |-- course 页面
      |-- course-detail 子页面

  |-- shared 公共工具及文件
      |-- axios axios封装
      |-- styles 公共样式

  |-- stores 全局状态管理

  --- main.ts 入口文件
  --- router.ts 路由文件
```

### 参与贡献
1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
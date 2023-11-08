# vue-easyWidget

无需路由轻松打开组件(目前仅支持 vite)

### 使用

建议目录结构 src/widgets/\*\*/index.vue 的编写规范

```
npm i vue-wasywidget
yarn add vue-easywidget

<!-- 在main.ts中注册组件 -->
import { setWidgetFile, registerWidgets } from 'vue-easywidget';
const files: any = import.meta.glob('@/widgets/**/index.vue', {
  eager: true,
});
const widgets = registerWidgets(files);

createApp(App).use(widgets).mount('#app');
```

### openWidget 打开组件

openWidget(组件名, 挂载节点)

```
<!-- 需要挂载的Test组件 -->
<template>
  <div>
    <div class="bg">TEST组件</div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'Test',
});
</script>
<style scoped>
.bg {
  width: 200px;
  height: 200px;
  background-color: pink !important;
}
</style>



<template>
  <div id="app"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { openWidget } from 'vue-easywidget';

onMounted(() => {
  openWidget('Test', 'app');
});
</script>





```

### closeWidget 关闭组件

closeWidget(组件名)

### getActiveWidgets 获取打开的组件

getActiveWidgets()

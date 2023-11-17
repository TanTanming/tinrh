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

### openWidget 打开微件

name 为需要打开的微件名称
id 即挂载的节点 id
options 为传递的配置项，可选

openWidget(name, id, options)

```
<!-- 需要挂载的Test组件 -->
<template>
  <div>
    <div class="bg">TEST组件</div>
  </div>
</template>
<script setup lang="ts">
import { useAttrs } from 'vue';

defineOptions({
  name: 'Test',
});

<!-- 获取传递打开微件时传递的参数 -->
const attrs = useAttrs()
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

### closeWidget 关闭微件

closeWidget(组件名)

### 关闭所有打开的微件

closeAllWidgets()

### getActiveWidgets 获取打开的微件

getActiveWidgets()

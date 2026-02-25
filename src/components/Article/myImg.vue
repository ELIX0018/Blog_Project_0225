<template>
<div>
  <n-avatar
   style="width: 100%;height: 100%"
      src="https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg"
  />

</div>
</template>

<script setup lang="ts">
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
const store = VaeStore();
let {clientWidth} = storeToRefs(store);

</script>

<style scoped>

</style>

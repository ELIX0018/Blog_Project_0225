<template>
<!--  个人中心-->
  <BackgroundPlate title="个人中心" description="这个人很简单，没什么好说的。" color="#3949ab"></BackgroundPlate>
  <n-grid :cols="8" >
    <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?6:8">
      <n-card   :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <InfoCard></InfoCard>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import BackgroundPlate from '../components/background/BackgroundPlate.vue'
import InfoCard from '../components/PersonalCenter/InfoCard.vue'
import {VaeStore} from "../store";
import {storeToRefs} from "pinia";
import {inject, onActivated, ref} from "vue";
import {useMessage} from "naive-ui";
import {onBeforeRouteLeave} from "vue-router";
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,isdarkTheme} = storeToRefs(store);
const message = useMessage()

//滚动条回到原位
const scrollBy = inject<Function>('scrollBy');
const remeberScroll=ref(0);
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个状态保存
  remeberScroll.value = distanceToTop.value;
  next()
})
//   组件激活
onActivated(() => {
  scrollBy? scrollBy(remeberScroll.value):''
})

</script>
<style scoped>
.margin-bottom0{
  margin-top: 5px;
  margin-bottom: 0px;
}
</style>

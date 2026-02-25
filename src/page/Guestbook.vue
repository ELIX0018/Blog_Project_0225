<template>
  <BackgroundPlate title="留言板" description="往往那些不起眼的小餐馆，才能吃到真正的美味，而那些大酒店的我吃不起。" color="#00897b"></BackgroundPlate>
 <n-grid :cols="8" >

    <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?6:8">
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <div :id="isdarkTheme ? 'darkComment':''"  >

        <GuestbookJs></GuestbookJs>
        </div>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import BackgroundPlate from '../components/background/BackgroundPlate.vue'
import GuestbookJs from '../components/Guestbook/guestbook-js.vue'
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

</style>

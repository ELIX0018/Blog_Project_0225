<template>
<!--  首页-->
  <div id="home" v-cloak >
      <n-grid  :cols="6"  item-responsive>
        <n-gi :span="6" class="home-title zwc-content-center" style="height: 95vh;">
<!--          背景 -五彩纸屑-->
          <vue-particles
              :key="particlesKey"
              style="position: absolute;height: 100vh"
              id="tsparticles"
              :particlesLoaded="particlesLoaded"
              :options='wucaizhixie'
          />
          <kinesis-container>

          <kinesis-element :strength="6">

            <n-h1 class="text-center">Zhang Apple</n-h1>
          </kinesis-element>
            <n-space  class="padding-bottom10">
            <n-text depth="3">
              满纸荒唐中窥见满脸沧桑 触到神经就要懂得鼓掌

            </n-text>
            </n-space>
            <n-space justify="center">
            <n-button @click="setDarkTheme">切换主题</n-button>
              <router-link to="/article">
            <n-button type="primary" >
              博客文章
            </n-button>
              </router-link>
            </n-space>
          </kinesis-container>

        </n-gi>
        <n-gi :span="10">
          <n-card
              embedded
              :bordered="false"
          >
            <n-space justify="center" >
              <n-gradient-text  :size="24" v-motion-pop-visible
                                :gradient="{
                  from: 'rgb(85, 85, 85)',
                  to: 'rgb(170, 170, 170)'
                }">
                生活充满阳光
              </n-gradient-text>

            </n-space>
            <br>
            <n-space justify="center" >
              <n-text depth="3">
                听说早睡早起身体好，于是我早早睡去，早早起来，发现还是很累。
              </n-text>

            </n-space>
            <br>
          </n-card>
          <br>

          <br>
        </n-gi>

        <n-gi style="margin: 15px"   span="6 1025:2  "  v-for="(item,index) in 9" :key="index">
          <a href="https://www.zhangpingguo.com/" target="_blank">
          <n-card
              v-motion-pop-visible-once
              title="🧣张苹果博客"
              hoverable
              :bordered="false"
          >
           更多信息请访问：https://www.zhangpingguo.com/
          </n-card>
          </a>
        </n-gi>
      </n-grid>


</div>
</template>

<script  setup lang="ts">
import {onActivated, ref,inject} from "vue"
import {VaeStore} from "../store";
import {storeToRefs} from "pinia";
import {Container} from "@tsparticles/engine";
import  {wucaizhixie} from '../utils/particlesFiles'
import { useDark, useToggle } from '@vueuse/core'
import {onBeforeRouteLeave} from "vue-router";
const isDark = useDark()
const particlesKey=ref(0)
const toggleDark = useToggle(isDark)

//获取store中的值
const store = VaeStore();
let {isdarkTheme,distanceToTop} = storeToRefs(store);
//切换主题，白天黑夜
const setDarkTheme=()=>{
  store.setdarkTheme(!isdarkTheme.value);
  toggleDark();
}


const particlesLoaded = async (container: Container) => {
};


//滚动条回到原位
const remeberScroll=ref(0);
const scrollBy = inject<Function>('scrollBy')
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前滚动条位置进行一个状态保存
  remeberScroll.value = distanceToTop.value;
  next()
})
//   组件激活
onActivated(() => {
  //背景重新渲染一下
  particlesKey.value++;
  //判断滚动条位置是否保存
  if (remeberScroll.value != null && remeberScroll.value > 0) {
    if(scrollBy){
      scrollBy(remeberScroll.value);
    }
  }else{
    //回到最顶部
    if(scrollBy){
      scrollBy(0);
    }
  }
})
</script>

<style lang="less" scoped>
#home{
  padding:0px 10px;
  .home-title{
    position: relative;
    height: 90vh;


  }
  .home-icon{
    position: absolute;
    top: 20px;
    bottom: 0px;
   font-size: 14px;
  }
  .padding-bottom10{
    padding-bottom: 10px;
  }

}

</style>

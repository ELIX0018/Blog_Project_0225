<template>
<!--  通用背景模板-->


  <div style="position: relative; user-select: none;box-shadow: 0 -1px 100px rgba(218,216,216,0.5)" class="zwc-content-center" :style="{'height':height?height:clientWidth>1025?'350px':'200px',marginBottom:clientWidth>1025?'10px':'0px'}">
    <vue-particles
        :key="particlesKey"
      class="particlesStyle"
        id="tsparticles"
        :particlesLoaded="particlesLoaded"
        :options='{...lizhi,   "background": {"color": {
        "value": !isdarkTheme?color:"rgb(14,14,14)"
    }}}'
    />
 <div style="position: relative;">
   <n-space justify="center">
     <n-h1 class="font-white" v-motion-pop>{{title}}</n-h1>
   </n-space>
   <n-text class="font-white" depth="3">
     {{description}}
   </n-text>
 </div>
  </div>
</template>

<script setup lang="ts">
//这些都可以尝试一下
import  {lizhi,dakeli,wucaizhixie,xuehua,zhezhao} from '../../utils/particlesFiles'
import {Container} from "@tsparticles/engine";

import {onActivated, ref} from "vue";
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
const particlesLoaded = async (container: Container) => {
  console.log(container);
};
const particlesKey=ref(0)
const store = VaeStore();
//解构
let {isdarkTheme,clientWidth} = storeToRefs(store);
const {title,
  description,
  type,
  height,
  color}=defineProps({
  title:{type:String,default:''},
  description:{type:String,default:''},
  type:{type:String,default:''},
  height:{type:String,default:''},
  color:{type:String,default:''},
})

//   组件激活
onActivated(() => {
  particlesKey.value++;
})
</script>

<style scoped>
.particlesStyle{
  position: absolute;top:0px;left:0px;right: 0px;bottom: 0px
}
.font-white{
  color: aliceblue
}
</style>

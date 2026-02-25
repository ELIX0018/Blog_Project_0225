<template>
 <div>

   <MyInformation></MyInformation>

   <n-alert title="温馨提示" type="info" >
    以下模块除“文章管理”和“随笔管理”模块之外。其他模块都复制的“标签管理”代码，但实际都差不多，您可以根据自身需求修改添加。
   </n-alert>
   <n-divider />
   <n-grid cols="4" x-gap="10"  item-responsive>
     <n-grid-item span="4 600:2 1025:1" v-for="(card,index) in cardList"    :key="index">
       <router-link :to="card.path" >
       <n-card hoverable>
         <template #header>
           <n-icon size="20"  :component="card.icon"> </n-icon>
           {{card.title}}
         </template>
         {{card.text}}
       </n-card>
       </router-link>
       <br>
     </n-grid-item>

   </n-grid>

 </div>
</template>

<script setup lang="ts">
import {defineComponent, h, ref, computed, reactive,shallowRef} from 'vue'
import MyInformation from './InfoCard/MyInformation.vue'
import { NIcon } from 'naive-ui'
import {
  BookOutline,
  BrushOutline,
  HeartOutline,
  ChatbubblesOutline,
  UnlinkOutline,
  PricetagOutline,
  PricetagsOutline,
  ChatbubbleEllipsesOutline,
  PeopleOutline, HomeOutline,
} from '@vicons/ionicons5';
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
const store = VaeStore();
let {userInfo} = storeToRefs(store);
const cardList=computed(()=>{
  return [
    {title:'文章管理',icon:BookOutline,text:'管理你的文章',path:'myArticle'},
    {title:'随笔管理',icon:BrushOutline,text:'管理你的随笔',path:'myDiarys'},
    {title:'网站管理',icon:HomeOutline,text:'管理你的网站',path:'blogManagement'},
    {title:'用户管理',icon:PeopleOutline,text:'管理你的用户',path:'myUsers'},
    {title:'评论管理',icon:ChatbubbleEllipsesOutline,text:'管理你的评论',path:'myComment'},
    {title:'赞助管理',icon:HeartOutline,text:'管理你的赞助',path:'myPayment'},
    {title:'留言管理',icon:ChatbubblesOutline,text:'管理你的留言',path:'myGuestBook'},
    {title:'友链管理',icon:UnlinkOutline,text:'管理你的友链',path:'myLinks'},
    {title:'标签管理',icon:PricetagOutline,text:'管理你的标签',path:'myLabel'},
    {title:'分类管理',icon:PricetagsOutline,text:'管理你的分类',path:'myClassify'},
  ]
})

</script>

<style scoped>

</style>

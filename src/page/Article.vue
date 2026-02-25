<template>
<!--  文章页-->
  <div id="article" >
    <n-grid cols="11" :x-gap="clientWidth>800?20:0" item-responsive :style="{opacity: showPage?1:0}" >
      <n-gi v-if="clientWidth>=1075"></n-gi>
      <n-gi v-if="clientWidth>=1075"></n-gi>
      <n-grid-item span="11 1025:11 1025:5" >
          <div v-for="(article,index) in articleList"  :key="index">
          <ArticleModule :articleInfo="article" v-motion-pop v-motion-pop-visible-once></ArticleModule>
         <br/>
        </div>
        <br>
      </n-grid-item>
      <n-grid-item v-if="clientWidth>=1075"  class="content" span="11 1025:11 1025:3" >
        <ArticleRightModule  :loadingSearch="loadingSearch" @searchArticle="searchArticle"   ></ArticleRightModule>
      </n-grid-item>
    </n-grid>

  </div>
</template>

<script  setup lang="ts">
import {ref,reactive,watch ,inject, onActivated} from "vue"
//这里发送请求方法
import { getArticlesApi } from '../utils/api'

import ArticleModule from '../components/Article/ArticleModule.vue'
import ArticleRightModule from '../components/Article/ArticleRightModule.vue'
import {VaeStore} from "../store";
import {storeToRefs} from "pinia";
import {useMessage} from "naive-ui";
import {onBeforeRouteLeave} from "vue-router";
const store = VaeStore();
const pageData=reactive({page:1,limit:8,articleContent:'',classifyId:''});
const loadingCard=ref(true);
const loadingEnd=ref(false);
const showPage=ref(true);

const loadingSearch=ref<Boolean | undefined>(undefined);
const message = useMessage()
//文章数据
const articleList=ref([
    {id:1,title:'标题标题标题',date:'20240108',labels:['笔记','生活']}
]);
//解构
let {clientWidth,distanceToBottom,distanceToTop} = storeToRefs(store);


//获取所有文章
const  get_ArticleAll=()=>{
  loadingCard.value = true;
  
  getArticlesApi(pageData)
    .then((response: any) => {
      if (response.ec === '0') {
        const { articles, pagination } = response.data;
        
        if (pageData.page === 1) {
          articleList.value = articles;
        } else {
          articleList.value = articleList.value.concat(articles);
        }
        
        // 判断是否还有更多数据
        if (articles.length < pageData.limit) {
          loadingEnd.value = true;
        }
        
        loadingCard.value = false;
      } else {
        message.error(response.em || '获取文章失败');
      }
    })
    .catch((error: any) => {
      console.error('获取文章错误:', error);
      message.error('获取文章失败，请检查网络连接');
      loadingCard.value = false;
    });
}

//搜索文章
const searchArticle= (content: string) => {
  pageData.page = 1;
  pageData.articleContent = content;
  
  get_ArticleAll();
}


//监听滚动条
watch(() => distanceToBottom.value, (newValue, oldValue) => {
  //如果滚动到了底部,加载更多文章,判断方法需自己根据情况加一下
  if(newValue<60){
    pageData.page++;
    get_ArticleAll();
  }
})




//下面的东西很多页面用到了，重复了，您可以想办法封装一下
//滚动条回到原位，
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
  showPage.value=false;
  setTimeout(()=>{
    showPage.value=true;
  },10)
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
#article{
  min-height: 100vh;
  padding: 0px 20px;
  padding-top: 10px;
}
</style>

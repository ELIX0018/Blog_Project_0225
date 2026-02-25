<template>
<!--  文章详情页面-->
   <div style="min-height: 100vh">
     <n-spin :show="loading">
     <n-grid :cols="clientWidth>=1900?10:8">
       <n-gi  :offset="ngiOffsetValue" :span="ngiSpanValue">
         <n-card id="id1">
             <PersonalProfile :articlesInfo="articlesInfo" ></PersonalProfile>
         </n-card>
         <br>
       </n-gi>
       <n-gi  :offset="ngiOffsetValue" :span="ngiSpanValue">
         <n-card>

           <template #header>
             <n-h1  id="header" style="margin-bottom:0;" prefix="bar" type="error">
               文章ID：{{articleId}}
             </n-h1>
           </template>

          <div :id="isdarkTheme ? 'darkEditor':''" style="min-height: 50vh" >
            <MdPreview
                :theme="isdarkTheme ? 'dark' : 'light'"
                v-model="articlesInfo.articleContent"
            />
          </div>
           <template #footer>
             <n-divider />
<!--             切换主题-->
             <div :id="isdarkTheme ? 'darkComment':''"  >
               <CommentJs :key="route.params.id" ref="commentJsRef" :articleId="route.params.id"></CommentJs>
             </div>
           </template>

         </n-card>
       </n-gi>
       <n-gi v-if="clientWidth>1100" :span="1">
         <Anchor :headingObjects="headingObjects" style="position: fixed;top:220px;right:14vw"></Anchor>
       </n-gi>
     </n-grid>
     </n-spin>


   </div>
</template>

<script setup lang="ts">
import {useRouter, useRoute, onBeforeRouteLeave} from "vue-router";
import PersonalProfile from './PersonalProfile.vue';
//评论组件
import CommentJs from '../comment/comment-js.vue'
//导航栏
import Anchor from './Anchor.vue';
import {storeToRefs} from "pinia";
import {VaeStore} from "../../store";
import {inject, onActivated, ref} from "vue";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { articleInfoType} from '../../utils/type'
import  publicComposition from '../../utils/publicComposition'
import {useMessage} from "naive-ui";
const {ngiSpanValue,ngiOffsetValue} =publicComposition();
const store = VaeStore();
let {clientWidth,distanceToTop,isdarkTheme} = storeToRefs(store);
const router = useRouter()
const route = useRoute()
//文章Id
const articleId=ref('');
const loading=ref(true);
const message = useMessage()
//调用传递过来的滚动条方法
const scrollBy = inject<Function>('scrollBy');
const headingObjects=ref<any>([]);
const commentJsRef: any = ref(null);
const articlesInfo=ref<articleInfoType>({
  articleContent:'',
  articleDate:'',
  userName:'',
  userId:'',
})


//滚动条回到原位
const remeberScroll=ref(0);
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个状态保存
  remeberScroll.value = distanceToTop.value;
  next()
})

//获取文章信息
const get_ArticlesById=()=>{
  loading.value=true;
  //获取传递过来的文章ID，通过id调用后端接口，获取文章信息。
  articleId.value=route.params.id as string;
  //这里使用假数据了,内容使用的markdown语法
   articlesInfo.value={articleContent:`# 测试 <br/> ![](https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg) <br/>## 标题`,
   articleDate:'2023-01-08',
     userId:'001',
   userName:'用户名称',};
    //这里获取文章页面的所有标题，组成导航栏
      headingObjects.value=[];
      setTimeout(()=>{
        loading.value=false;
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (let i = 0; i < headings.length; i++) {
          const heading = headings[i];
          const id = `heading-${i}`;
          //给标签添加id
          heading.setAttribute('id', id);
          const headingObject = {
            id: '#'+id,
            value: heading.textContent
          };
          headingObjects.value.push(headingObject);
        }

      },500)

}
get_ArticlesById();


//   组件激活
onActivated(() => {
  if (route.params.id!=articleId.value) {
    scrollBy?scrollBy(0):'';
    commentJsRef.value.get_CommentsAll(route.params.id);
    get_ArticlesById();
  }else{
      scrollBy?scrollBy(remeberScroll.value):'';
  }
})





</script>

<style lang="less" scoped>
.userInfo-background{
  background: antiquewhite;
  height: 200px;
  width: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
}



</style>

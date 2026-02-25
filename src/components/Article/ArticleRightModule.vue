<template>
<div style="width: 353px;" :class="distanceToTop>300?'falling-dot':''" >
  <n-card  v-motion-roll-top   :embedded="isdarkTheme" :bordered="!isdarkTheme" >
    <n-space >

    <n-input ref="searchInputRef" :loading="loadingSearch" clearable v-model:value="articleContent"  type="text" placeholder="请输入内容或标题！"/>
      <n-button  type="primary" :disabled="loadingSearch" @click="searchBtn">
        搜 索
      </n-button>
    </n-space>
  </n-card>
  <br>
  <n-card >
    <template #header>
      <n-h3 prefix="bar" class="margin-bottom0px" align-text type="info">
        微博实时热搜
      </n-h3>

    </template>  <template #header-extra>
        <n-icon size="20" @click="get_weibo" v-if="!loading" style="cursor: pointer">
          <ReloadSharp></ReloadSharp>
        </n-icon>
    </template>
    <n-spin :show="loading">
      <div v-if="weiboList.length==0 && loading">
        <n-skeleton text :repeat="5" />
        <n-skeleton text style="width: 60%" />
        <n-skeleton text :repeat="2" />
      </div>


      <n-list hoverable clickable>
      <n-a v-for="(item,index) in weiboList" :href="item.url" target="_blank" >
        <n-list-item >
          <n-text depth="2">
            <n-tag  :type="index==0?'error':index==1?'info':index==2?'success':''">
              {{index+1}}
            </n-tag> {{item.title}}

          </n-text>
        </n-list-item>
      </n-a>

    </n-list>
    </n-spin>
  </n-card>

</div>
</template>

<script  setup lang="ts">
import {ref} from 'vue';
import { InputInst,useMessage } from 'naive-ui'
import {storeToRefs} from "pinia";
import {VaeStore} from "../../store";
const emit=defineEmits(['searchArticle']);
import {ReloadSharp} from '@vicons/ionicons5'
const { loadingSearch } = defineProps({
  loadingSearch:{type: Boolean || undefined},
})
const store = VaeStore();
const weiboList=ref<any>([]);
const message = useMessage()
let {isdarkTheme,distanceToTop} = storeToRefs(store);
const searchInputRef=ref<InputInst | null>(null);
const articleContent=ref("");
const loading=ref(true);
const get_weibo=()=>{
  loading.value=true;
try{
  weiboList.value=[{title:'博客上线了',url:'https://www.zhangpingguo.com'},{title:'博客上线了',url:'https://www.zhangpingguo.com'},{title:'博客上线了',url:'https://www.zhangpingguo.com'},{title:'博客上线了',url:'https://www.zhangpingguo.com'}]
  loading.value=false;

}catch (e) {
  message.error('微博热搜榜加载失败，请稍后重试！')
  loading.value=false;

}
}
get_weibo();
const searchBtn=()=>{

  emit('searchArticle',articleContent.value)
}

</script>

<style scoped>

.falling-dot {
  position:fixed;

  animation: falling 0.2s ;

}
@keyframes falling {
  0% {
   opacity: 0;
    transform: translateY(-50%);

  }
  50% {
    opacity: 0;


  }  80% {
    opacity: 1;


  }
  100% {

    transform: translateY(0px);
    transform: translateY(-20px);
    transform: translateY(0px);


  }
}
</style>

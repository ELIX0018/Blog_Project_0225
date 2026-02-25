<template>
<!--个人信息
  感觉这里您应该用不到
-->
  <div style="min-height: 100vh">
    <n-grid :cols="8">
      <n-gi  :offset="clientWidth>1075?1:0" :span="clientWidth>1075?6:8">
        <n-card >
        <n-thing :content-indented="clientWidth>1075">
          <template  #avatar>
            <n-space justify="center">
              <n-avatar
                  :size="clientWidth>1075?100:50"
                  src="https://img.zhangpingguo.com/apple_Article_Head/apple1704348343094/cc648282-99fe-4161-90f3-dedca8cfcf7e.jpg"
              />
            </n-space>
          </template>
          <template  #header>
            <n-gradient-text
                style="display: inline"
                :gradient="{
      to: 'rgb(16,15,15)',
      from: 'rgb(196,189,189)'
    }"
            >
            ID:{{userId}}<n-tag type="primary" >
              普通用户
            </n-tag>
            </n-gradient-text>
          </template>
          <template  #header-extra>
           <n-space justify="end">
             <n-popover trigger="hover" placement="bottom" >
               <template #trigger>
                 <n-button  size="small"  type="primary" dashed>
                   微信
                 </n-button>
               </template>
               <span>无</span>
             </n-popover>
             <n-popover trigger="hover" placement="bottom" >
               <template #trigger>
                 <n-button  size="small"   type="error" dashed>
                   QQ
                 </n-button>
               </template>
               <span>无</span>

             </n-popover>

             <n-popover trigger="hover" placement="bottom" >
               <template #trigger>
                 <n-button  size="small"   type="warning" dashed>
                   微博
                 </n-button>
               </template>
               <span>无</span>

             </n-popover>
           </n-space>
          </template>
           签名
          <template  #action>
            <n-space>

              <n-button size="small" tertiary type="primary">

                <template #icon>
                  <n-icon>
                    <DocumentTextOutline/>
                  </n-icon>
                </template>
               3篇文章
              </n-button>
              <n-button size="small" tertiary type="info">
                <template #icon>
                  <n-icon>
                    <ChatbubbleEllipsesOutline />
                  </n-icon>
                </template>
                3次评论
              </n-button>
              <n-button size="small" tertiary type="error">
                <template #icon>
                  <n-icon>
                    <HeartOutline />
                  </n-icon>
                </template>
               2个点赞
              </n-button>
            </n-space>
          </template>
        </n-thing>
        </n-card>
        <br>

        <n-card >
          <template #header>
            <n-h2  id="header" style="margin-bottom:0;" prefix="bar" type="error">
             已发布文章
            </n-h2>
          </template>
          <n-grid x-gap="12" cols="10" item-responsive>
            <n-grid-item   v-motion-fade span="10 1025:5  "  v-for="(item,index) in 5" :key="index">

              <n-card hoverable @click="detailsBtn(item)" title="标题">
                <n-ellipsis :tooltip="false" :line-clamp="2">
                  春风十里，不如你
                </n-ellipsis>
                <template #action>
                  <n-space justify="end">
                    发布于：20240108
                  </n-space>
                </template>
              </n-card>

              <br>
            </n-grid-item>
          </n-grid>
          <n-space justify="center">
            <n-spin size="medium"  v-show="loadingCard"  />
            <n-text depth="3" v-if="loadingEnd  && !noData">
              <n-icon :size="15">
                <GolfOutline></GolfOutline>
              </n-icon> 没有更多了
            </n-text>
          </n-space>
          <n-empty v-if="articleTable.length==0 && !loadingCard" size="large" description="这里什么都木有-_-">

          </n-empty>
        </n-card>
      </n-gi>

    </n-grid>


  </div>
</template>

<script setup lang="ts">
import {DocumentTextOutline,ChatbubbleEllipsesOutline,HeartOutline} from '@vicons/ionicons5'
import { ref} from "vue";
import { useRoute, useRouter} from "vue-router";
import {GolfOutline} from '@vicons/ionicons5'
import {storeToRefs} from "pinia";
import {VaeStore} from "../store";
import {useMessage, useNotification} from "naive-ui";
const route = useRoute()
const router = useRouter()
const store = VaeStore();
let {clientWidth,distanceToBottom} = storeToRefs(store);
const notification = useNotification();
const message=useMessage();
const loadingCard=ref(true);
const noData=ref(false);
const loadingEnd=ref(false);
const articleTable=ref<any>([])
//通过用户id获取用户的所有信息。
const userId=ref(route.params.id);

//查询详情
const detailsBtn=(id:string)=>{
  router.push({ path: `/articleDetails/${id}` });
}



</script>

<style scoped>

</style>

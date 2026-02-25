<template>
<!--  个人描述-->
<div >
  <n-thing>

    <template #avatar>
      <n-avatar  :size="48"
                 src="https://img.zhangpingguo.com/apple_Article/apple1704348343094/43de4a65-48e4-432b-b724-a09316ee6991.jpg"
      ></n-avatar>
    </template>
    <template #header>
      {{articlesInfo.userName}}
    </template>
    <template  #header-extra>
      <n-button  secondary strong @click="getInfo(articlesInfo.userId)">查看信息</n-button>
    </template>
    <template  #description>
     发布日期:{{articlesInfo.articleDate}}
    </template>
    <template #action>
      <n-space >
        <n-button icon-placement="right"  type="error" tertiary  @click="like_Article">
          <template #icon>
            <n-icon>
              <HeartOutline/>
            </n-icon>
          </template>
          点赞数
          <n-number-animation :from="0" :to="10" />



        </n-button>
        <n-button icon-placement="right"  type="info"  tertiary >
          <template #icon>
            <n-icon>
              <ChatbubbleEllipsesOutline/>
            </n-icon>
          </template>
          评论数
          <n-number-animation :from="0" :to="22"  />
        </n-button>
        <n-button icon-placement="right" type="warning"  tertiary >
          <template #icon>
            <n-icon>
              <EarthOutline/>
            </n-icon>
          </template>
          浏览量<n-number-animation :from="0" :to="33"  />
        </n-button>


      </n-space>
    </template>
  </n-thing>
</div>
</template>

<script setup lang="ts">
import {ChatbubbleEllipsesOutline,EarthOutline,HeartOutline} from '@vicons/ionicons5'
import {defineProps, onActivated} from 'vue'
import {PropType} from "vue/dist/vue";
import {type articleInfoType} from "../../utils/type";
import {onBeforeRouteLeave, useRouter} from "vue-router";
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
import {useMessage} from "naive-ui";
const router = useRouter()
const message = useMessage()
//获取传递过来的值
const { articlesInfo } = defineProps({
  articlesInfo:{type: Object as PropType<articleInfoType>,required: true},
})

const store = VaeStore();
let {clientWidth} = storeToRefs(store);

//点赞
const like_Article=()=>{
      message.success('点赞成功！')
}

//查看信息
const getInfo=(userId:string)=>{
  router.push({ path: `/personalDetails/${userId}` });
}


//   组件激活
onActivated(() => {
  console.log('激活',articlesInfo)
})
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  next()
})
</script>

<style scoped>

</style>

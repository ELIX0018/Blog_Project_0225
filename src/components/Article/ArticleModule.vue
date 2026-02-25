<template>
<!--文章板块-->
  <div >
    <kinesis-container>
      <kinesis-element :strength="5" type="depth">
    <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme" @click="detailsBtn(articleInfo.id)" >
      <template #header>
        <n-h3 style="margin-bottom:0;" prefix="bar" type="primary">
          <n-ellipsis :tooltip="false" style="max-width: 100%">
           {{articleInfo.title}}
          </n-ellipsis>
        </n-h3>
      </template>
      <template #header-extra>
        {{articleInfo.date}}
      </template>
      <n-grid x-gap="5"  :cols="10">
        <n-gi :span="10">
          <n-ellipsis :tooltip="false" style="width: 100%"  :line-clamp="clientWidth>800?8:3">
          <n-image
              v-if="clientWidth>800"
              class="my_image"
              :width="clientWidth>2000?370:290"
              :height="clientWidth>2000?180:130"
              src="https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg"
              preview-disabled
          />
{{getChinese(articleInfo.title)}}
            </n-ellipsis>        </n-gi>
      </n-grid>
      <template #footer>
        <n-space>
          <n-tag v-for="(label,index) in articleInfo.labels" :type="index%2==0?'info':'error'"> {{label}} </n-tag>
        </n-space>
      </template>
      <template #action>
        <n-space justify="end">
          <n-icon :size="iconSize">
            <HeartOutline/>
          </n-icon>10
          <n-icon :size="iconSize">
            <ChatbubbleEllipsesOutline/>
          </n-icon>20<n-icon :size="iconSize">
            <EarthOutline/>
          </n-icon>30
        </n-space>
      </template>
    </n-card>            </kinesis-element>

    </kinesis-container>

  </div>


</template>

<script setup lang="ts">
import {computed} from 'vue'
import { useRouter ,} from 'vue-router'
import type { PropType } from "vue";
import {VaeStore} from "../../store";
import type {ArticleType} from '../../utils/type'
import {storeToRefs} from "pinia";
import {getChinese} from '../../utils/function'
import {ChatbubbleEllipsesOutline,EarthOutline,HeartOutline} from '@vicons/ionicons5'
const store = VaeStore();
const router = useRouter()
//接受传递过来的值
const { articleInfo } = defineProps({
  articleInfo:{type: Object as PropType<ArticleType>,required: true},
})

//解构pinia
let {clientWidth,distanceToTop,isdarkTheme} = storeToRefs(store);

//查询文章详情
const detailsBtn=(id:string)=>{
  //跳转文章详情页面，携带文章id
  router.push({ path: `/articleDetails/${id}` });
}
//图标大小
const iconSize=computed(()=>{
  return clientWidth.value>800?20:10;
})

</script>

<style scoped>
.my_image {
  vertical-align: top;
  padding:0px 5px;
  float: right;
}
</style>

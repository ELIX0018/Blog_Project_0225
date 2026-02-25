<template>
  <BackgroundPlate title="友情链接" description="人有没有钱是看不出来的,当我们在街上擦肩而过的时候,你绝不会想到我竟然是超级会员?" color="#1976d2"></BackgroundPlate>
 <n-grid :cols="8" >
    <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?6:8">
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <template #header>
          <n-h2 class="margin-bottom0" prefix="bar" type="info" >
            友链说明
          </n-h2>
        </template>
        <template #header-extra>
           <n-button strong secondary type="info" @click="addlinkShowModal=true">
             申请友链
        </n-button>
        </template>
          <n-icon size="22"><CloseOutline/></n-icon>经常宕机
          <n-icon size="22"><CloseOutline/></n-icon>不合法规
          <n-icon size="22"><CloseOutline/></n-icon>插边球站
          <n-icon size="22"><CloseOutline/></n-icon>红标报毒
          <n-icon size="22"><CheckmarkOutline/></n-icon> 原创优先
          <n-icon size="22"><CheckmarkOutline/></n-icon> 技术优先
        <br>
        <n-h6 class="margin-bottom0">本站链接如下：</n-h6>
         <n-text tag="div"> 名称：张苹果</n-text>
         <n-text tag="div"> 网址：https://www.zhangpingguo.com/</n-text>
         <n-text tag="div"> 图标：https://www.zhangpingguo.com</n-text>
         <n-text tag="div"> 描述：这个人很简单，没什么好说的。</n-text>
        <br>
        <n-text depth="3">温馨提示：本站友链随机排列，不定时清除失效友链。</n-text>
        <n-divider />
        <n-h2 prefix="bar" type="info" >
          友链列表
        </n-h2>
        <n-grid x-gap="12" :cols="4" item-responsive>
          <n-gi  span="4 400:2 800:2 1075:1" v-for="(link,index) in linkList" :key="index">
            <LinkCardBox :link="link"></LinkCardBox>
            <br>
          </n-gi>
        </n-grid>
        <n-empty v-if="linkList.length==0 && !loadingEnd" size="large" description="暂无友链">
        </n-empty>

      </n-card>
    </n-gi>
  </n-grid>
  <!--  新增-->
  <n-modal     :mask-closable="false"  v-model:show="addlinkShowModal">
    <n-card
        :style="{'width':clientWidth>1025?'500px':'96%'}"
        title="友链信息填写"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button tertiary @click="addlinkShowModal=false">
          <template #icon>
            <n-icon size="22">
              <CloseOutline/>
            </n-icon>
          </template>
        </n-button>
      </template>
<!--      编辑获取新增友链卡片-->
      <LinkCard  @closeBtn="closeBtn" @linkAdded="get_LinksAll"  :isAdd="true"></LinkCard>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import BackgroundPlate from '../components/background/BackgroundPlate.vue'
import LinkCardBox from '../components/FriendLink/LinkCardBox.vue'
import LinkCard from '../components/MyLinks/LinkCard.vue'
import {CheckmarkOutline,CloseOutline} from '@vicons/ionicons5'
import {VaeStore} from "../store";
import {storeToRefs} from "pinia";
import {inject, onActivated, ref, onMounted} from "vue";
import {useMessage} from "naive-ui";
import {onBeforeRouteLeave} from "vue-router";
import {getLinksApi} from "../utils/api";
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,isdarkTheme} = storeToRefs(store);
const linkList=ref<any>([]);
const loadingEnd=ref(false);
const addlinkShowModal=ref(false);
const message = useMessage()


const closeBtn=()=>{
  addlinkShowModal.value=false;
}


const get_LinksAll=async()=>{
  try {
    const response = await getLinksApi();
    if (response.ec === '0') {
      linkList.value = response.data.map((item: any) => ({
        linkName: item.link_name,
        linkLink: item.link_link,
        linkIcon: item.link_icon,
        linkDescribe: item.link_describe
      }));
    } else {
      message.error(response.em);
    }
  } catch (error) {
    message.error('获取友链失败，请稍后重试');
    console.error('获取友链失败:', error);
  } finally {
    loadingEnd.value = true;
  }
}

// 组件挂载时获取友链列表
onMounted(() => {
  get_LinksAll();
});

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
.margin-bottom0{
  margin-top: 5px;
  margin-bottom: 0px;
}
</style>

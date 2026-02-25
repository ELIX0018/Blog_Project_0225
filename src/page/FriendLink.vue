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

        <n-divider v-if="isAdmin()" />
        <n-card v-if="isAdmin()" :embedded="true" title="待审核友链申请">
          <template #header-extra>
            <n-button size="small" @click="loadPendingLinks">刷新</n-button>
          </template>
          <n-spin :show="loadingPending">
            <div v-if="pendingLinks.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
              <n-card v-for="link in pendingLinks" :key="link.id" :embedded="true" size="small">
                <n-space>
                  <n-avatar :size="48" :src="formatImageUrl(link.link_icon)" fallback-src="https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg" round>{{ link.link_name?.charAt(0) || '?' }}</n-avatar>
                  <div style="flex: 1">
                    <n-text strong>{{ link.link_name }}</n-text>
                    <br />
                    <n-a :href="formatUrl(link.link_link)" target="_blank" style="font-size: 12px">{{ link.link_link }}</n-a>
                  </div>
                  <n-space>
                    <n-button size="small" type="info" @click="showDetail(link)">详情</n-button>
                    <n-button size="small" type="success" @click="handleApprove(link.id)">通过</n-button>
                    <n-button size="small" type="error" @click="handleReject(link.id)">拒绝</n-button>
                  </n-space>
                </n-space>
              </n-card>
            </div>
            <n-empty v-else-if="!loadingPending" size="small" description="暂无待审核的友链申请" />
          </n-spin>
        </n-card>

      </n-card>

  <n-modal v-model:show="detailModal.show" preset="card" title="友链申请详情" style="width: 500px">
    <n-descriptions :column="1" bordered v-if="detailModal.data">
      <n-descriptions-item label="网站名称">{{ detailModal.data.link_name }}</n-descriptions-item>
      <n-descriptions-item label="网站地址">
        <n-a :href="formatUrl(detailModal.data.link_link)" target="_blank">{{ detailModal.data.link_link }}</n-a>
      </n-descriptions-item>
      <n-descriptions-item label="网站图标">
        <n-avatar :src="formatImageUrl(detailModal.data.link_icon)" fallback-src="https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg" round>
          {{ detailModal.data.link_name?.charAt(0) || '?' }}
        </n-avatar>
      </n-descriptions-item>
      <n-descriptions-item label="网站描述">{{ detailModal.data.link_describe || '无' }}</n-descriptions-item>
      <n-descriptions-item label="联系邮箱">{{ detailModal.data.email || '无' }}</n-descriptions-item>
      <n-descriptions-item label="申请时间">{{ detailModal.data.created_at }}</n-descriptions-item>
    </n-descriptions>
    <template #footer>
      <n-space justify="end">
        <n-button type="success" @click="handleApprove(detailModal.data.id)">通过</n-button>
        <n-button type="error" @click="handleReject(detailModal.data.id)">拒绝</n-button>
      </n-space>
    </template>
  </n-modal>
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
import {inject, onActivated, ref, onMounted, watch} from "vue";
import {useMessage} from "naive-ui";
import {onBeforeRouteLeave} from "vue-router";
import {getLinksApi, getPendingLinksApi, approveLinkApi, rejectLinkApi} from "../utils/api";
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,isdarkTheme,userInfo} = storeToRefs(store);
const linkList=ref<any>([]);
const loadingEnd=ref(false);
const addlinkShowModal=ref(false);
const pendingLinks=ref<any>([]);
const loadingPending=ref(false);
const message = useMessage()
const isAdmin = () => userInfo.value && userInfo.value.userPowerId >= 999;
const detailModal = ref({ show: false, data: null as any });

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

const loadPendingLinks = async () => {
  if (!isAdmin()) return;
  loadingPending.value = true;
  try {
    const response = await getPendingLinksApi();
    if (response.ec === '0') {
      pendingLinks.value = response.data;
    } else {
      message.error(response.em || '获取待审核友链失败');
    }
  } catch (error: any) {
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      message.error('获取待审核友链失败，请稍后重试');
    }
  } finally {
    loadingPending.value = false;
  }
};

const showDetail = (link: any) => {
  detailModal.value.data = link;
  detailModal.value.show = true;
};

const handleApprove = async (id: string) => {
  try {
    const response = await approveLinkApi(id);
    if (response.ec === '0') {
      message.success('审核通过');
      detailModal.value.show = false;
      await loadPendingLinks();
      await get_LinksAll();
    } else {
      message.error(response.em || '审核失败');
    }
  } catch (error) {
    message.error('审核失败，请稍后重试');
  }
};

const handleReject = async (id: string) => {
  try {
    const response = await rejectLinkApi(id);
    if (response.ec === '0') {
      message.success('已拒绝该申请');
      detailModal.value.show = false;
      await loadPendingLinks();
    } else {
      message.error(response.em || '拒绝失败');
    }
  } catch (error) {
    message.error('拒绝失败，请稍后重试');
  }
};

const formatUrl = (url: string) => {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return 'http://' + url;
};

const formatImageUrl = (url: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return 'http://' + url;
};

// 组件挂载时获取友链列表
onMounted(() => {
  get_LinksAll();
  if (isAdmin()) {
    loadPendingLinks();
  }
});

watch(userInfo, (newVal, oldVal) => {
  if (newVal && newVal.userPowerId >= 999 && pendingLinks.value.length === 0) {
    loadPendingLinks();
  }
}, { deep: true });

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
  if (isAdmin()) {
    loadPendingLinks();
  }
})

</script>
<style scoped>
.margin-bottom0{
  margin-top: 5px;
  margin-bottom: 0px;
}
</style>

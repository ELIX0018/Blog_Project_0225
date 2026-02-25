<template>
  <BackgroundPlate title="随笔一记" description="听说休息不规律,对身体危害很大;吓得我天天熬夜,熬得很有规律。" color="#f4511e"></BackgroundPlate>
   <n-grid :cols="6" >
    <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?4:6">
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <!-- 发布随笔区域 - 仅管理员可见 -->
        <div v-if="isAdmin" class="publish-section">
          <n-card 
            :embedded="isdarkTheme" 
            :bordered="!isdarkTheme"
            class="publish-card"
          >
            <n-space vertical :size="16">
              <n-space align="center" justify="space-between">
                <n-space align="center">
                  <n-avatar :src="userInfo.userHead || 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg'" :size="40" />
                  <span class="publish-username">{{ userInfo.userName || 'Admin' }}</span>
                  <n-tag size="small" type="error" :bordered="false">站长</n-tag>
                </n-space>
                <n-text depth="3" class="publish-tip">分享你的所思所想...</n-text>
              </n-space>
              
              <MdEditor
                v-model="publishContent"
                :theme="isdarkTheme ? 'dark' : 'light'"
                :toolbars="[
                  'bold',
                  'underline',
                  'italic',
                  '-',
                  'title',
                  'strikeThrough',
                  'quote',
                  'unorderedList',
                  'orderedList',
                  '-',
                  'codeRow',
                  'code',
                  'link',
                  'image',
                  'table',
                  '-',
                  'revoke',
                  'next',
                  'preview'
                ]"
                placeholder="写下你的随笔内容..."
                style="min-height: 200px"
              />
              
              <n-space justify="end">
                <n-button @click="clearContent">清空</n-button>
                <n-button 
                  type="primary" 
                  :loading="publishing"
                  :disabled="!publishContent.trim()"
                  @click="publishDiary"
                >
                  <template #icon>
                    <n-icon><SendOutline /></n-icon>
                  </template>
                  发布随笔
                </n-button>
              </n-space>
            </n-space>
          </n-card>
          <n-divider />
        </div>

        <n-timeline size="large">
          <template v-if="loadingCard">
            <n-skeleton v-for="n in 3" :key="n" height="100px" style="margin-bottom: 20px" />
          </template>
          <template v-else>
            <DiaryModule 
              v-for="(diary,index) in diaryList" 
              :key="diary.id" 
              v-motion-pop   
              v-motion-slide-visible-once-bottom   
              :diary="diary"
              :index="index"
            ></DiaryModule>
          </template>
        </n-timeline>
        <n-divider/>
        <n-space justify="center">
          <n-spin v-if="loadingCard" size="medium" />
          <n-text v-else-if="loadingEnd" depth="3">
            <n-icon :size="15">
              <PawOutline></PawOutline>
            </n-icon> 没有更多了
          </n-text>
          <n-text v-else-if="diaryList.length === 0" depth="3">
            <n-icon :size="15">
              <PawOutline></PawOutline>
            </n-icon> 暂无随笔内容
          </n-text>
        </n-space>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import BackgroundPlate from '../components/background/BackgroundPlate.vue'
import DiaryModule from '../components/Diary/DiaryModule.vue';
import {PawOutline, SendOutline} from '@vicons/ionicons5'
import {VaeStore} from "../store";
import { getDiariesApi, createDiaryApi } from '../utils/api'
import {storeToRefs} from "pinia";
import {inject, onActivated, reactive, ref, watch, onMounted, computed} from "vue";
import {useMessage} from "naive-ui";
import {onBeforeRouteLeave} from "vue-router";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,isdarkTheme,userInfo} = storeToRefs(store);
const pageData=reactive({page:1,limit:8,apple:'1'});
const message = useMessage()

const diaryList = ref<any[]>([]);
const loadingCard = ref(true);
const loadingEnd = ref(false);

// 发布相关
const publishContent = ref('');
const publishing = ref(false);

// 判断是否为管理员
const isAdmin = computed(() => {
  return userInfo.value.userPowerId >= 999;
});

// 发布随笔
const publishDiary = async () => {
  if (!publishContent.value.trim()) {
    message.warning('请输入随笔内容');
    return;
  }

  try {
    publishing.value = true;
    const response = await createDiaryApi({
      content: publishContent.value.trim()
    });

    if (response && response.ec === '0') {
      message.success('发布成功！');
      publishContent.value = '';
      // 刷新列表
      pageData.page = 1;
      loadingEnd.value = false;
      await get_DiarysAll();
    } else {
      const errorMsg = response ? response.em : '未知错误';
      message.error('发布失败: ' + errorMsg);
    }
  } catch (error: any) {
    console.error('发布随笔失败:', error);
    const errorMsg = error?.response?.data?.em || error?.message || '网络错误，发布失败';
    message.error(errorMsg);
  } finally {
    publishing.value = false;
  }
};

// 清空内容
const clearContent = () => {
  publishContent.value = '';
};

//获取所有日记
const get_DiarysAll = async () => {
  try {
    loadingCard.value = true;
    const response = await getDiariesApi({
      page: pageData.page,
      limit: pageData.limit
    });
    
    if (response && response.ec === '0') {
      if (pageData.page === 1) {
        diaryList.value = response.data.diaries;
      } else {
        diaryList.value = [...diaryList.value, ...response.data.diaries];
      }
      
      // 检查是否还有更多数据
      if (response.data.diaries.length < pageData.limit) {
        loadingEnd.value = true;
      }
    } else {
      const errorMsg = response ? response.em : '未知错误';
      message.error('获取随笔失败: ' + errorMsg);
    }
  } catch (error: any) {
    console.error('获取随笔失败:', error);
    const errorMsg = error?.response?.data?.em || error?.message || '网络错误，无法获取随笔';
    message.error(errorMsg);
  } finally {
    loadingCard.value = false;
  }
}

// 组件挂载时获取日记
onMounted(() => {
  get_DiarysAll();
});



//监听滚动条
watch(() => distanceToBottom.value, (newValue, oldValue) => {
  //如果滚动到了底部
  if(newValue<60 && !loadingCard.value && !loadingEnd.value){
    pageData.page++;
    get_DiarysAll();
  }
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
.publish-section {
  margin-bottom: 20px;
}

.publish-card {
  background: rgba(244, 81, 30, 0.03);
  border: 1px solid rgba(244, 81, 30, 0.1);
}

.publish-username {
  font-weight: 600;
  font-size: 15px;
}

.publish-tip {
  font-size: 13px;
  font-style: italic;
}

:deep(.md-editor) {
  border-radius: 8px;
  border: 1px solid var(--n-border-color);
}

:deep(.md-editor-dark) {
  background-color: var(--n-color);
}
</style>

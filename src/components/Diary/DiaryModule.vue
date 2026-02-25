<template>
    <n-timeline-item
        :icon-size="60"
        type="success"
    >
      <template #default>
        <n-thing >
          <template  #avatar>
            <n-avatar :src="diary.userHead || 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg'">
            </n-avatar>
          </template>
          <template #header >
           <div style="padding-top: 5px">
             {{ diary.userName || 'Apple' }}
             <n-tag  size="small"  type="error" :bordered="false">
               站长
             </n-tag>
           </div>
          </template>

          <template #header-extra>
            <n-text depth="3">
              {{ formatDate(diary.diaryDate) }}
            </n-text>

          </template>
          <n-card
              style="padding-top: 0px"
              embedded
              :bordered="false"
          >
          <MdPreview style="background: none" :editorId="'editor' + index"
                          :theme="isdarkTheme ? 'dark' : 'light'"
                          :modelValue="diary.content" />
          </n-card>
        </n-thing>
      </template>
    </n-timeline-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

interface Props {
  diary: any;
  index: number;
}

const props = defineProps<Props>();

const store = VaeStore();
let {clientWidth,isdarkTheme} = storeToRefs(store);

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知日期';
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  } catch (error) {
    return '未知日期';
  }
}
</script>

<style scoped>

</style>

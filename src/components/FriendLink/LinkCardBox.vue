<template>
  <n-a
      :href="formattedLink"
      target="_blank"
  >
  <n-card  hoverable>
    <n-thing>
      <template #avatar>
        <n-avatar  size="medium" :src="link.linkIcon"
                   fallback-src="https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg"
        >
        </n-avatar>
      </template>
      <template #header>
        {{link.linkName}}
      </template>
      <n-ellipsis expand-trigger="click" line-clamp="2" style="min-height: 40px" :tooltip="false">
    {{link.linkDescribe}}
      </n-ellipsis>
    </n-thing>
  </n-card>
  </n-a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const {link} = defineProps({link:{type:Object}});

// 格式化链接，确保包含协议前缀
const formattedLink = computed(() => {
  if (!link.linkLink) return '#';
  
  // 如果链接已经以 http:// 或 https:// 开头，直接返回
  if (link.linkLink.startsWith('http://') || link.linkLink.startsWith('https://')) {
    return link.linkLink;
  }
  
  // 否则添加 https:// 前缀
  return 'https://' + link.linkLink;
});
</script>

<style scoped>

</style>

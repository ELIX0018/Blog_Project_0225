<template>
  <n-a
      :href="formatUrl(link.linkLink)"
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

const {link}=defineProps({link:{type:Object}})

const formatUrl = (url: string) => {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return 'http://' + url;
}
</script>

<style scoped>

</style>

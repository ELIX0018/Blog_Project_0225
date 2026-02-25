<template>
<div>

  <n-anchor
      affix
      listen-to=".n-layout-scroll-container"
      style="z-index: 1"
      :bound="24"
  >
    <n-anchor-link v-for="(text,index) in headingObjects"  :key="index" :title="text.value" :href="text.id" />

  </n-anchor>
</div>
</template>

<script setup lang="ts">
const { headingObjects } = defineProps({
  headingObjects:{type:Array ,required: true},

})
</script>

<style scoped>

</style>

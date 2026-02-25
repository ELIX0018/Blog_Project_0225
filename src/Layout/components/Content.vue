<template>
    <div class="content-box">
        <n-layout-content  ref="contentRef"

                         >

    <slot></slot>

      </n-layout-content>
    </div>
  </template>

  <script  setup lang="ts">
  import {ref} from "vue"
  import { LayoutInst } from 'naive-ui'
  const contentRef = ref<LayoutInst | null>(null)
  </script>

  <style lang="less" scoped></style>

<template>
  <kinesis-container>
    <kinesis-element :strength="5" type="depth">
      <n-card>
        <template #header>
          <n-skeleton text style="width: 20%" />
        </template>
        <template #header-extra>
          <n-skeleton text style="width: 20%" />
        </template>
        <n-skeleton text style="width: 60%" />
        <n-skeleton text style="width: 70%" />
        <n-skeleton text :repeat="2" />
        <template #footer>
          <n-skeleton height="40px" width="100" :sharp="false" />
        </template>
        <template #action>
          <n-skeleton  text style="width: 10%" />   <n-skeleton text style="width: 10%" />
        </template>
      </n-card>
    </kinesis-element>
    <br/>
  </kinesis-container>
</template>

<script lang="ts">

</script>

<style scoped>

</style>

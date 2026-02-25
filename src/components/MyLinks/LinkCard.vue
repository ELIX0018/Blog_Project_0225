<template>
<n-spin :show="linkLoading">
  <n-form
      ref="formRef"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
  >
    <n-grid cols="2" x-gap="10" item-responsive>
      <n-grid-item span="2 820:1 1025:1">
        <n-form-item label="联系邮箱:">
          <n-auto-complete
              ref="editModelEmailRef"
              v-model:value="editLinkModel.linkEmail"
              :input-props="{
                  autocomplete: 'disabled'
                }"
              :options="emailOptions"
              placeholder="审核结果将通过邮箱发送给您"
              clearable
          />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="2 820:1 1025:1">
        <n-form-item label="网站名称:">
          <n-input  ref="linkNameRef"  @keydown.enter="saveLink"   clearable v-model:value="editLinkModel.linkName" placeholder="请输入网站名称"/>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="2 820:1 1025:1">
        <n-form-item label="网站地址:">
          <n-input  ref="linkLinkRef"  @keydown.enter="saveLink"  clearable v-model:value="editLinkModel.linkLink" placeholder="请输入网站地址"/>
        </n-form-item>
      </n-grid-item>
     <n-grid-item span="2 820:1 1025:1">
        <n-form-item label="网站图标:">
          <n-input  ref="linkIconRef"  @keydown.enter="saveLink"  clearable  v-model:value="editLinkModel.linkIcon" placeholder="请输入网站图标地址"/>
        </n-form-item>
      </n-grid-item>
     <n-grid-item span="2 820:1 1025:1">
        <n-form-item label="网站描述:">
          <n-input ref="linkDescribeRef"  @keydown.enter="saveLink"   clearable  v-model:value="editLinkModel.linkDescribe" placeholder="请输入网站描述"/>
        </n-form-item>
      </n-grid-item>

      <n-grid-item span="2">
        <n-space justify="center">
          <n-form-item>

            <n-button @click="closeBtn">
              取消
            </n-button>&nbsp;
            <n-button type="info" @click="saveLink">
              确认
            </n-button>
          </n-form-item>
        </n-space>

      </n-grid-item>

    </n-grid>


  </n-form>
</n-spin>
</template>

<script setup lang="ts">

import {computed, ref} from "vue";
import {InputInst, useMessage, useNotification} from "naive-ui";
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
import {createLinkApi} from "../../utils/api";
const emit=defineEmits(['closeBtn', 'linkAdded']);
const editModelEmailRef = ref<InputInst | null>(null)
const linkNameRef = ref<InputInst | null>(null)
const linkLinkRef = ref<InputInst | null>(null)
const linkIconRef = ref<InputInst | null>(null)
const linkDescribeRef = ref<InputInst | null>(null)
const notification = useNotification();
const message = useMessage()
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,userInfo} = storeToRefs(store);
const linkLoading=ref(false)
const editLinkModel = ref({
  linkName: '',
  linkLink: '',
  linkIcon: '',
  linkDescribe: '',
  linkEmail: '',
  linkId: '',
})
const { linkInfo,isAdd } = defineProps({
  linkInfo:null,
  isAdd:{type:Boolean},
})
if(linkInfo){
  editLinkModel.value={...linkInfo};
}
//保存友链
const saveLink=()=>{
let {linkName,
  linkLink,
  linkIcon,
  linkDescribe,
  linkEmail}=editLinkModel.value;
if(!linkEmail){
  message.error('请输入联系邮箱')
  editModelEmailRef.value?.focus();

return;
}
if(!linkName){
    message.error('请输入网站名称')
  linkNameRef.value?.focus();

    return;
}if(!linkLink){
    message.error('请输入网站地址')
    linkLinkRef.value?.focus();

    return;
}if(!linkIcon){
    message.error('请输入网站图标')
    linkIconRef.value?.focus();

    return;
}if(!linkDescribe){
    message.error('请输入网站描述')
    linkDescribeRef.value?.focus();

    return;
}
  linkLoading.value=true;
  message.info('参数：'+JSON.stringify(editLinkModel.value))
if(!isAdd){
  update_Links();

}else{
  add_Links();
}
setTimeout(()=>{
  linkLoading.value=false;
},1000)

}
//新增
const add_Links=async()=>{
  try {
    const { linkName, linkLink, linkIcon, linkDescribe } = editLinkModel.value;
    const response = await createLinkApi({
      link_name: linkName,
      link_link: linkLink,
      link_icon: linkIcon,
      link_describe: linkDescribe
    });
    if (response.ec === '0') {
      message.success(response.em);
      setTimeout(() => {
        emit('linkAdded');
        emit('closeBtn');
      }, 1000);
    } else {
      message.error(response.em);
    }
  } catch (error) {
    message.error('添加友链失败，请稍后重试');
    console.error('添加友链失败:', error);
  }
}
//编辑
const update_Links=()=>{
  //调用方法
  console.log(editLinkModel.value)
}



//关闭友链
const closeBtn=()=>{
  emit('closeBtn')
}
//邮箱
const emailOptions = computed(() => {
  return ['@qq.com', '@163.com'].map((suffix) => {
    const prefix =editLinkModel.value.linkEmail.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
});
</script>

<style scoped>

</style>

<template>
  <n-layout-header style="z-index: 99;padding: 0px;" >
    <n-menu style="padding-top: 10px" :style="{ float: isPC ? 'right' : 'right' }"  v-model:value="activeKey"
      mode="horizontal" :options="menuOptions" @update:value="handleUpdateValue" />
    <n-button v-if="!appleToken" class="login-style" strong secondary @click="showModal=true">登录</n-button>
    <n-dropdown v-else  trigger="click" :options="options" @select="handleSelect">
      <n-avatar
          class="login-style"
          round
          size="medium"
          :src="!userInfo.qqId?userInfo.userHead:userInfo.qqImg"
      />
    </n-dropdown>
  </n-layout-header>
<!--  登录注册弹框-->
  <n-modal v-model:show="showModal">
    <LoginCard @setShowModal="showModal=false"></LoginCard>
  </n-modal>
</template>

<script setup lang="ts">
import {  h, ref, Component, watch } from 'vue'
import LoginCard from '../../components/Login/LoginCard.vue'
import {NIcon, NMenu, useDialog, useMessage} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {removeCookies} from '../../utils/auth'
import { VaeStore } from '../../store'
//使pinia变响应式
import { storeToRefs } from 'pinia'
import {
  BrushOutline,
  ChatbubblesOutline,
  UnlinkOutline,
  DesktopOutline,
  HomeOutline,
  LogOutOutline ,
  BookOutline as BookIcon,
  PersonCircleOutline as UserIcon,
  MenuOutline as MenuIcon
} from '@vicons/ionicons5'
//解构
const store = VaeStore();
let { isPC ,clientWidth,activeKey,appleToken,userInfo} = storeToRefs(store);
const showModal=ref(false);
const dialog = useDialog()
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const  options= [
      {
        label: '个人中心',
        key: 'message',
        icon: renderIcon(UserIcon)
      },
      {
        label: '退出',
        key: "exit",
        icon: renderIcon(LogOutOutline)
      }
    ];
//退出登录
const handleSelect=(key:string)=>{
  if(key=='exit'){
    dialog.warning({
      title: '退出登录',
      content: '是否退出当前账号？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: () => {
        removeCookies('appleToken');
        removeCookies('userInfo');
        store.setappleToken("");
        location.reload();
      }
    })
  }else{
    emit('goPath','personalCenter')
  }
}
//这里是导航菜单栏
const meunList = [{
  label: '首页',
  key: 'home',
  icon: renderIcon(HomeOutline)
},

  {
    label: '文章' ,
    key: 'article',
    icon: renderIcon(BookIcon),

  },{
    label: '随笔' ,
    key: 'diary',
    icon: renderIcon(BrushOutline),

  },{
    label: '留言' ,
    key: 'guestbook',
    icon: renderIcon(ChatbubblesOutline),

  },{
    label: '友链' ,
    key: 'friendLink',
    icon: renderIcon(UnlinkOutline),

  },{
    label: '关于' ,
    key: 'message',
    icon: renderIcon(DesktopOutline),

  }]
let menuOptions: MenuOption[] = [

]

//响应式
watch(clientWidth, (oldisPC, newisPC) => {
  if (clientWidth.value>1025) {
    menuOptions = [...meunList]
  } else {
    menuOptions = [
      {
        label: renderIcon(MenuIcon),
        key: 'dance-dance-dance',
        children: [
          ...meunList

        ]
      }
    ]
  }

}, {  immediate: true })

//调用父组件方法
const emit=defineEmits(['goPath'])

//菜单点击事件
const handleUpdateValue =(key: string, item: MenuOption)=> {
  activeKey.value=key;
  //跳转路由
 emit('goPath',key)
      }

</script>
<style scoped>
.login-style{
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 15px;
}
</style>

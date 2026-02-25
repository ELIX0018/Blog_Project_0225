<template>
  <n-card
      embedded
      :bordered="false"
  >

    <n-spin :show="userInfoLoading">

      <n-thing>
        <template #avatar>
          <n-avatar
              :size="58"
             :src="updateHeader"
          />
        </template>
        <template #header>
          名称
          <n-tag type="error">
            站长
          </n-tag>
        </template>
        <template #header-extra>
          <n-space justify="end">
            <n-button strong secondary @click="editShowModal=true" type="info">
              编辑信息
            </n-button>
            <n-button strong secondary @click="message.success('您应该不需要，需要的话加一个弹框')" type="error">
              权限详情
            </n-button>
          </n-space>

        </template>
        <template #description>
          <n-text depth="3">
            注册时间：2024-01-08
          </n-text>
        </template>
        这个人很简单，没什么好说的
        <template #action>
        </template>
      </n-thing>

    </n-spin>
    <!--  编辑弹框-->
    <n-modal v-model:show="editShowModal" :key="editShowModal">
      <n-card
          :style="{'width':clientWidth>1025?tabKey!=1?'500px':'60%':'96%'}"
          title="正在编辑信息"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
      >

        <template #header-extra>
          <n-button tertiary @click="editShowModal=false">
            <template #icon>
              <n-icon size="22">
                <CloseOutline/>
              </n-icon>
            </template>
          </n-button>

        </template>
        <n-spin :show="edituserInfoLoading">
          <n-tabs type="segment"  v-model:value="tabKey">
            <n-tab-pane name="1" tab="基本信息">
              <n-blockquote>
                <n-text depth="3">
                您的邮箱不对外使用，只用来接收信息；如为空或错误,您将无法收到信息。(如:他人回复了您的评论或留言,将通过邮箱提醒您)。
                </n-text>
              </n-blockquote>

              <n-form
                  ref="formRef"
                  :model="editModel"
                  label-placement="left"
                  label-width="auto"
                  require-mark-placement="right-hanging"
              >
                <n-grid cols="2" x-gap="10" item-responsive>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="年龄">
                      <n-input-number style="width: 100%" v-model:value="editModel.userAge" clearable
                                      placeholder="请输入年龄"/>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="性别">
                      <n-select v-model:value="editModel.userSex" placeholder="请选择性别" :options="sexOptions"/>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="生日">
                      <n-input v-model:value="editModel.userBirthday" placeholder="请输入生日"/>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="电话">
                      <n-input v-model:value="editModel.userPhone" placeholder="请输入电话"/>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="爱好">
                      <n-input v-model:value="editModel.userHobby" placeholder="请输入爱好"/>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="地址">
                      <n-input v-model:value="editModel.userAddress" placeholder="请输入地址"/>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="邮箱">
                      <n-auto-complete
                          ref="editModelEmailRef"
                          v-model:value="editModel.userEmail"
                          :input-props="{
                  autocomplete: 'disabled'
                }"
                          :options="emailOptions"
                          placeholder="请输入邮箱"
                          clearable
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="微博">
                      <n-input v-model:value="editModel.userWb" placeholder="请输入微博"/>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 820:1 1025:1">
                    <n-form-item label="微信">
                      <n-input v-model:value="editModel.userWx" placeholder="请输入微信"/>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2">
                    <n-form-item label="签名">
                      <n-input
                          v-model:value="editModel.userSignature"
                          placeholder="请输入您的签名"
                          type="textarea"
                          :autosize="{
                            minRows: 3,
                            maxRows: 5
                          }"
                      />
                    </n-form-item>

                  </n-grid-item>
                  <n-grid-item span="2">
                    <n-space justify="center">
                    <n-form-item>

                        <n-button @click="editShowModal=false">
                          取消
                        </n-button>&nbsp;
                        <n-button type="info" @click="saveInfo">
                          保存
                        </n-button>
                    </n-form-item>
                    </n-space>

                  </n-grid-item>

                </n-grid>


              </n-form>
            </n-tab-pane>
            <n-tab-pane  name="2" tab="修改头像" >
              <br>
              <n-space justify="center">
                <n-avatar
                    :size="100"
                    :src="updateHeader"
                />
              </n-space>
              <n-divider />
              <n-space justify="center">
<!--        图片上传，请修改成自己接口-->
                <n-upload
                    @before-upload="onBeforeUpload"
                    @finish="onFinish"
                    :show-file-list="false"
                    action="/api/uploadImg"
                >
                  <n-button>上传头像</n-button>
                </n-upload>

                <n-button type="info" @click="saveHead">
                保存
              </n-button>
              </n-space>
            </n-tab-pane>
            <n-tab-pane  name="3" tab="修改密码">
              <n-form>
              <n-form-item-row label="新密码">
                <n-input   ref="updateUserPwdRef"  clearable   show-password-on="mousedown" placeholder="请输入密码"   v-model:value="updatePwdForm.userPassword" type="password"/>
              </n-form-item-row>
              <n-form-item-row label="确认新密码">
                <n-input     clearable  show-password-on="mousedown" placeholder="请输入确认密码"  v-model:value="updatePwdForm.newUserPassword" type="password"/>
              </n-form-item-row>
                <n-divider />
                  <n-space justify="center">


                    <n-button @click="editShowModal=false">
                      取消
                    </n-button>&nbsp;

                    <n-button type="info" @click="savePwd">
                      确定
                    </n-button>
                  </n-space>

              </n-form>
            </n-tab-pane>
            <n-tab-pane   name="4" tab="修改用户名">
              <br>
              <n-input ref="updateNewNameRef"  v-model:value="userNewName" placeholder="请输入新用户名"/>
              <n-divider />
              <n-space justify="center">
                <n-button @click="editShowModal=false">
                  取消
                </n-button>&nbsp;

                <n-button type="info" @click="saveUserName">
                  确定
                </n-button>
              </n-space>

            </n-tab-pane>
          </n-tabs>

        </n-spin>


      </n-card>
    </n-modal>

  </n-card>

</template>
<script setup lang="ts">
import { ref, reactive, inject, onActivated, computed} from 'vue'
import {InputInst, NIcon, useMessage, useNotification} from 'naive-ui';
import * as imageConversion from 'image-conversion';
import {
  CloseOutline,
} from '@vicons/ionicons5'
import {VaeStore} from "../../../store";
import {storeToRefs} from "pinia";
import {onBeforeRouteLeave} from "vue-router";
import {setCookies} from "../../../utils/auth";
const message = useMessage()
const notification = useNotification();
const store = VaeStore();
let {clientWidth, distanceToBottom, distanceToTop, userInfo} = storeToRefs(store);
const editShowModal = ref(false)
const userInfoLoading = ref(false)
const edituserInfoLoading = ref(false)
const updateHeader = ref('');
const userNewName = ref('');
const tabKey = ref('1');
updateHeader.value=userInfo.value.userHead;
const editModelEmailRef = ref<InputInst | null>(null)
const updateUserPwdRef = ref<InputInst | null>(null)
const updateNewNameRef = ref<InputInst | null>(null)
const updatePwdForm=reactive({
  userPassword:'',
  newUserPassword:'',
})
const powerForm=reactive({
  userEmail:'',
  reason:'',
})
const editModel = ref({
  userAddress: '',
  userAge: 0,
  userBirthday: '',
  userEmail: '',
  userHobby: '',
  userPhone: '',
  userPowerId: '',
  userDate: '',
  userQq: '',
  userSex: '',
  userSignature: '',
  userWb: '',
  userWx: '',
})
const userForm = ref({
  userAddress: '',
  userAge: 0,
  userBirthday: '',
  userDate: '',
  userEmail: '',
  userHobby: '',
  userPhone: '',
  userPowerId: '',
  userQq: '',
  userSex: '',
  userSignature: '',
  userWb: '',
  userWx: '',
});
const ispower=computed(()=>{
  return  userForm.value.userPowerId!='0' && userForm.value.userPowerId!='3';
});

const sexOptions = [{
  label: '男',
  value: '男'
}, {
  label: '女',
  value: '女'
}]



//邮箱
const emailOptions = computed(() => {
  return ['@qq.com', '@163.com'].map((suffix) => {
    const prefix = editModel.value.userEmail.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
});


//修改用户名
const saveUserName=()=>{
  if(!userNewName.value){
    message.error('请输入您的用户名！');
    updateNewNameRef.value?.focus();
    return;
  }
  edituserInfoLoading.value=true;
  message.info('参数：'+JSON.stringify(userNewName.value))
  //发送修改用户名请求
  setTimeout(()=>{
    edituserInfoLoading.value=false;

  },1000)

}
//保存密码
const savePwd=()=>{
let {newUserPassword}=updatePwdForm;
  if(!updatePwdForm.userPassword){
    message.error('请输入新密码！');
    updateUserPwdRef.value?.focus();
    return;
  }

  if(newUserPassword!=updatePwdForm.userPassword){
    message.error('两次密码输入不一致！');
    updateUserPwdRef.value?.focus();
    return;
  }
  edituserInfoLoading.value=true;
  message.info('参数：'+JSON.stringify(updatePwdForm))

  //发送保存密码请求
  setTimeout(()=>{
    edituserInfoLoading.value=false;

  },1000)
}
//保存头像
const saveHead=()=>{
  if(!updateHeader.value){
    message.error('请先上传图片！')
    return;
  }
  edituserInfoLoading.value = true;
  //发送保存头像请求

  //
  setTimeout(()=>{
    edituserInfoLoading.value=false;
  },1000)
}
//保存个人信息
const saveInfo = () => {
  edituserInfoLoading.value = true;
  //发送保存个人信息请求
  message.info('参数：'+JSON.stringify(userInfo.value))

  //
  setTimeout(()=>{
    edituserInfoLoading.value=false;
  },1000)
}
// 获取用户基本信息
const get_MyUserInfo = () => {
  userInfoLoading.value = true;
  setTimeout(()=>{
    userInfoLoading.value=false;
  },1000)
  //发送获取用户信息请求

  //请求成功后将信息保存至store，cookie
  // userForm.value =
  // editModel.value = ;
  // store.setuserInfo({...userInfo.value})
  // setCookies('userInfo',JSON.stringify({...userInfo.value}));

}
get_MyUserInfo();
//上传前
const onBeforeUpload=((file:any, fileList:any)=>{
  edituserInfoLoading.value=true;
  return new Promise((resolve, reject) => {
                                              //图片压缩至20kb
    imageConversion.compressAccurately(file.file.file, 20).then(res => {
      file.file.file = new File([res], file.file.file.name, { type: res.type, lastModified: Date.now() })
      resolve(file.file.file)
    })
  })


})
//上传后
const onFinish=((file:any)=>{
  let data =(file.event?.target as XMLHttpRequest).response;
  console.log(data)

})
//滚动条回到原位
const scrollBy = inject<Function>('scrollBy');
const remeberScroll = ref(0);
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个状态保存
  remeberScroll.value = distanceToTop.value;
  next()
})
//   组件激活
onActivated(() => {
  scrollBy ? scrollBy(remeberScroll.value) : ''
})
</script>

<style scoped>

</style>

<template>
  <n-card
      :style="{'width':clientWidth>1025?'40%':'96%'}"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
  >
    <n-spin :show="showloading">

    <n-tabs default-value="signin" size="large" justify-content="space-evenly">
      <n-tab-pane name="signin" tab="登录">
        <n-form>
          <n-form-item-row label="用户名">
            <n-input ref="loginUserNameRef"  @keydown.enter="loginBtn"    clearable placeholder="请输入用户名"    v-model:value="loginForm.userName"/>
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input ref="loginUserPwdRef"  @keydown.enter="loginBtn"    clearable  show-password-on="mousedown" placeholder="请输入密码"   type="password" v-model:value="loginForm.password"/>
          </n-form-item-row>
        </n-form>
     <n-space justify="center">
       <n-button type="error" block secondary strong>
         <template #icon>
           <n-icon>
             <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 448 512"><path d="M433.754 420.445c-11.526 1.393-44.86-52.741-44.86-52.741c0 31.345-16.136 72.247-51.051 101.786c16.842 5.192 54.843 19.167 45.803 34.421c-7.316 12.343-125.51 7.881-159.632 4.037c-34.122 3.844-152.316 8.306-159.632-4.037c-9.045-15.25 28.918-29.214 45.783-34.415c-34.92-29.539-51.059-70.445-51.059-101.792c0 0-33.334 54.134-44.859 52.741c-5.37-.65-12.424-29.644 9.347-99.704c10.261-33.024 21.995-60.478 40.144-105.779C60.683 98.063 108.982.006 224 0c113.737.006 163.156 96.133 160.264 214.963c18.118 45.223 29.912 72.85 40.144 105.778c21.768 70.06 14.716 99.053 9.346 99.704z" fill="currentColor"></path></svg>
           </n-icon>
         </template>
         QQ登录
       </n-button>
       <n-button type="info" block secondary strong @click="loginBtn">
         确认登录
       </n-button>
     </n-space>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form>
          <n-form-item-row label="用户名"
                           :validation-status="inputUserNameStatus"
                           :feedback="inputUserNameFeedbackval"
          >
            <n-input ref="registerUserNameRef"  @keydown.enter="register"   placeholder="请输入用户名" @blur="judge_UserName"  v-model:value="registerObj.userName" maxlength="16" show-count clearable/>
          </n-form-item-row>
          <n-form-item-row label="邮箱">
            <n-auto-complete
                @keydown.enter="register"
                ref="registerEmailRef"
                v-model:value="registerObj.userEmail"
                :input-props="{
                  autocomplete: 'disabled'
                }"
                :options="emailOptions"
                placeholder="请输入邮箱"
                clearable
            />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input   ref="registerUserPwdRef"  @keydown.enter="register"   clearable   show-password-on="mousedown" placeholder="请输入密码"   v-model:value="registerObj.userPassword" type="password"/>
          </n-form-item-row>
          <n-form-item-row label="确认密码">
            <n-input   ref="registerPwdRef" @keydown.enter="register"  clearable  show-password-on="mousedown" placeholder="请输入确认密码"  v-model:value="newUserPassword" type="password"/>
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong @click="register">
          注册
        </n-button>
      </n-tab-pane>
    </n-tabs>
    </n-spin>

  </n-card>
</template>

<script setup lang="ts">
import {VaeStore} from "../../store";
import {ref, computed, reactive,inject} from 'vue'
import {storeToRefs} from "pinia";
import {setCookies} from '../../utils/auth'
import {getUserId} from '../../utils/function'
import {  useDialog, useMessage,InputInst , useNotification,} from 'naive-ui';
import { loginApi, registerApi } from '../../utils/api';
const notification = useNotification();
const emit = defineEmits(['setShowModal']);
const dialog = useDialog()
const store = VaeStore();
let { clientWidth,userInfo} = storeToRefs(store);
const message=useMessage();
const newUserPassword=ref('');
const showloading=ref(false);
const registerEmailRef= ref<InputInst | null>(null)
const registerPwdRef= ref<InputInst | null>(null)
const registerUserNameRef= ref<InputInst | null>(null)
const registerUserPwdRef= ref<InputInst | null>(null)
const loginUserNameRef= ref<InputInst | null>(null)
const loginUserPwdRef= ref<InputInst | null>(null)
const registerObj=reactive({
  userEmail:'',
  userId:getUserId(),
  userName:'',
  userPassword:'',
});
const loginForm=reactive({
  userName:'admin',
  password:'admin',
})
//邮箱
const emailOptions= computed(() => {
  return ['@qq.com','@163.com'].map((suffix) => {
    const prefix = registerObj.userEmail.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
});
//用户登录
const loginBtn=()=>{
    let {userName,password} =loginForm;
    if(!userName){
      message.error('用户名不能为空！');
      loginUserNameRef.value?.focus()
      return;
    }
    if(!password){
      message.error('密码不能为空！');
      loginUserPwdRef.value?.focus()
      return;
    }

  login_Request(userName,password);

};
//登录接口
const   login_Request=(userName:string,password:string)=>{
  showloading.value=true;
  
  // 调用后端登录接口
  loginApi({ username: userName, password: password })
    .then((response: any) => {
      if (response.ec === '0') {
        const { token, userInfo } = response.data;
        
        // pinia存储信息
        store.setuserInfo(userInfo);
        store.setappleToken(token);
        
        // cookie存储用户信息
        setCookies('appleToken', token);
        setCookies('userInfo', JSON.stringify(userInfo));
        
        message.success('登录成功！');
        
        // 关闭弹框，刷新页面
        emit('setShowModal');
        location.reload();
      } else {
        message.error(response.em || '登录失败');
      }
    })
    .catch((error: any) => {
      console.error('登录错误:', error);
      message.error('登录失败，请检查网络连接');
    })
    .finally(() => {
      showloading.value = false;
    });
}
//用户注册
const register=()=>{
  let {userEmail,userId,  userName,  userPassword}=registerObj;
  if(!userName){
    message.error('用户名不能为空！');
    registerUserNameRef.value?.focus()
    return;
  }
  if(inputUserNameStatus.value){
    message.error('用户名已存在！');
    registerUserNameRef.value?.focus()
    return;
  }
  if(!userEmail){
    message.error('请输入您的邮箱！')
    registerEmailRef.value?.focus();
    return;
  }
  if(userEmail.indexOf('@')==-1){
    message.error('请检查邮箱是否正确！')
    return;
  }
  if(!userPassword){
    message.error('请输入您的密码！');
    registerUserPwdRef.value?.focus();

    return;
  } if(!newUserPassword.value){
    message.error('请输入确认密码！');
    registerPwdRef.value?.focus();

    return;
  }
  if(userPassword!=newUserPassword.value){
    message.error('两次密码输入不一致!');
    registerUserPwdRef.value?.focus();
    return;
  }
  showloading.value=true;
  
  // 调用后端注册接口
  registerApi(registerObj)
    .then((response: any) => {
      if (response.ec === '0') {
        const { token, userInfo } = response.data;
        
        // pinia存储信息
        store.setuserInfo(userInfo);
        store.setappleToken(token);
        
        // cookie存储用户信息
        setCookies('appleToken', token);
        setCookies('userInfo', JSON.stringify(userInfo));
        
        message.success('注册成功！');
        
        // 关闭弹框，刷新页面
        emit('setShowModal');
        location.reload();
      } else {
        message.error(response.em || '注册失败');
      }
    })
    .catch((error: any) => {
      console.error('注册错误:', error);
      message.error('注册失败，请检查网络连接');
    })
    .finally(() => {
      showloading.value = false;
    });
}
//验证用户名是否重复，不需要可以删除
const inputUserNameFeedbackval=ref<string|undefined>(undefined);
const inputUserNameStatus=ref<string|undefined>(undefined);
const judge_UserName=()=>{
    //这里还需做一些操作，具体可以看naiveui官网输入框的验证。
      inputUserNameStatus.value='';
      inputUserNameFeedbackval.value=''

}






</script>

<style scoped>

</style>

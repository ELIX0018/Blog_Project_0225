<template>
<div>
<!--  具体请看官方文档  https://imzbf.github.io/md-editor-v3/en-US/index-->
  <MdEditor :toolbars="[
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
    0,
    1,
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog',
]"   :theme="isdarkTheme ? 'dark' : 'light'" ref="mdeditorRef" v-model="mdEditorContent"    @onUploadImg="onUploadImg" @onSave="saveBtn()">

    <template #defToolbars>
      <NormalToolbar title="视频" @onClick="showModalVideo=true">
        <template #trigger>
          <n-icon style="padding-bottom: 5px;cursor: pointer" :size="20" >
            <CaretForwardCircleOutline/>
          </n-icon>
        </template>
      </NormalToolbar>
      <NormalToolbar title="设置图片压缩" @onClick="imguploadLoading=true">
        <template #trigger>
          <n-icon style="padding-bottom: 5px;cursor: pointer" :size="16" >
            <FlowerSharp/>
          </n-icon>
        </template>
      </NormalToolbar>
    </template>


  </MdEditor>
  <!--  图片压缩-->
  <n-modal v-model:show="imguploadLoading">
    <n-card
        :style="{'width':clientWidth>1025?'500px':'96%'}"
        size="huge"
    >
      <n-blockquote>
        设置图片压缩，图片将压缩到指定大小后上传，小于或等于0则不压缩，默认200kb。
      </n-blockquote>
      <n-input-number v-model:value="CompressionSize" clearable placeholder="请输入压缩大小(KB)" />
      <n-divider/>
      <n-space justify="center">
        <n-button @click="imguploadLoading=false">
          取消
        </n-button>&nbsp;

        <n-button type="info" @click="imguploadLoading=false">
          确定
        </n-button>
      </n-space>
    </n-card>
  </n-modal>
  <!-- 视频上传 -->
  <n-modal v-model:show="showModalVideo">
    <n-card
        :style="{ 'width': clientWidth > 1020 ? '50%' : '90%' }"
        title="视频上传"
        :bordered="false"
    >

      <template #header-extra>
        <n-button tertiary @click="showModalVideo=false">
          <template #icon>
            <n-icon size="22">
              <CloseOutline/>
            </n-icon>
          </template>
        </n-button>

      </template>
      <n-spin :show="loginShow">

        <n-form ref="formRef" label-placement="left" :label-width="100">

          <n-form-item label="视频地址">
            <n-input v-model:value="VideoUrl" placeholder="输入视频地址，也可点击下方上传视频获取。"/>
          </n-form-item>
          <n-form-item label="获取地址">
<!--            修改成自己的上传接口-->
            <n-upload accept="video/*" @before-upload="onBeforeUploadVideo" @finish="onFinishVideo"
                      @error="onErrorVideo" :show-file-list="false" action="/api/uploadImg"
                      :data="{userID:1}">
              <n-button>
                上传视频
              </n-button>
            </n-upload>
          </n-form-item>

        </n-form>

        <n-blockquote>可能常用的样式：style="width:100%;height:350px"</n-blockquote>

      </n-spin>
      <template #footer>
        <n-space justify="center">
          <n-button @click="VideoBtn" :disabled="loginShow">确定</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</div>
</template>

<script setup lang="ts">
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
import {ref,watch} from "vue";
import { useRouter} from "vue-router";
import { FlowerSharp,CloseOutline,CaretForwardCircleOutline} from '@vicons/ionicons5';
import { MdEditor ,NormalToolbar} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {NButton, useMessage,useDialog, useNotification} from 'naive-ui'
const tableShow=ref(false);
const mdEditorContent=ref('');
const mdeditorRef  = ref();
const message = useMessage()
const router = useRouter()
const dialog = useDialog()
const notification = useNotification();
import axios from "axios";
import * as imageConversion from "image-conversion";
const imguploadLoading=ref(false)
const showModalVideo=ref(false)
const loginShow=ref(false)
const VideoUrl  = ref('');
const CompressionSize  = ref(200);
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,userInfo,isdarkTheme} = storeToRefs(store);
//接收父组件值
const {content}=defineProps({
  content:{type:String},
})

//监听内容
watch(()=>content,(newValue,oldValue)=>{
  console.log(newValue)
  mdEditorContent.value=newValue as string;
},{immediate:true,deep:true})

const emit=defineEmits(['saveBtn'])

//保存，调用父接口
const saveBtn=()=>{
  emit('saveBtn')
}

//是否有值
const isValue=()=>{
  if(!mdEditorContent.value.trim()){message.error('内容不能为空！');mdeditorRef.value?.insert(() => {
    return {
      targetValue: ``,
      select: false,
      deviationStart: 0,
      deviationEnd: 1
    };
  });return;}else{return mdEditorContent.value};
}
defineExpose({
  isValue,
});
//视频上传
const VideoBtn = () => {
  if (VideoUrl.value) {
    mdeditorRef.value?.insert(() => {
      /**
       * @return targetValue    待插入内容
       * @return select         插入后是否自动选中内容
       * @return deviationStart 插入后选中内容鼠标开始位置
       * @return deviationEnd   插入后选中内容鼠标结束位置
       */
      return {
        targetValue: `<video src="${VideoUrl.value}" controls width="100%" height="100%"></video>`,
        select: false,
        deviationStart: 0,
        deviationEnd: 1
      };
    });
    showModalVideo.value = false;

  } else {
    message.error('视频地址不能为空！')
  }

}
//视频上传前
const onBeforeUploadVideo = ((file: any, fileList: any) => {
  loginShow.value = true;
  return new Promise(async (resolve, reject) => {
    imageConversion.compressAccurately(file.file.file, undefined).then(res => {
      file.file.file = new File([res], file.file.file.name, {type: res.type, lastModified: Date.now()})
      resolve(file.file.file)
    })


  })


})
//上传后
const onFinishVideo = ((file: any) => {
  let data2 = (file.event?.target as XMLHttpRequest).response;
  if (JSON.parse(data2).ec == '0') {
    VideoUrl.value = JSON.parse(data2).data.src

  } else {
    message.error(JSON.parse(data2).em)
  }

  loginShow.value = false;

})
const onErrorVideo = () => {
  loginShow.value = false;
  message.info('视频上传失败，视频过大请压缩后尝试上传。');
}
// 图片上传
const onUploadImg = async (files: FileList, callback: (urls: string[]) => void) => {
  const res = await Promise.all(
      Array.from(files).map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('img', file);

          // 压缩到100KB,这里的100就是要压缩的大小,可自定义
          imageConversion.compressAccurately(file, CompressionSize.value>0 ? CompressionSize.value : undefined).then(res => {
            file = new File([res], file.name, {type: res.type, lastModified: Date.now()})
            let {userId} = userInfo.value;

            loginShow.value = true;
            try {
              // 发送请求，获取图片地址，请修改成自己的上传接口
              axios.post(
                  "/api/uploadImg",
                  {'userId': userId},
                  {
                    headers: {'Content-Type': 'multipart/form-data'}
                  }
              )
                  .then(res => {
                    if (res.data.ec == '0') {
                      rev([res.data.data.src])
                    } else {
                      message.error(res.data.em)
                    }

                    loginShow.value = false;
                    // 清空上传进度数据
                  }).catch(e => {
                message.error("请求出错，图片可能过大请开启压缩后尝试！")
                loginShow.value = false;
              })
            } catch (error) {
              message.error("请求出错，请稍后重试！")
              loginShow.value = false;
            }

          });


        });
      })
  );

  callback(res.map((item: any) => item));
}
</script>

<style scoped>

</style>

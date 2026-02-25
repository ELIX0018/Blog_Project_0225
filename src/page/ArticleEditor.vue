<template>
<!--文章新增或编辑页面-->
  <n-grid :cols="10" >

    <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?8:10">
  <n-card class="margin-bottom10">
    <template #header>
      <n-h2 prefix="bar" class="margin-bottom0px" align-text>
       {{route.params.id=='add'?'正在新增文章':'正在编辑文章'}}
      </n-h2>
    </template>
  </n-card>
    <n-card >
      <n-spin size="small" :show="editLoading">

      <n-form
        ref="formRef"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
    >
      <n-grid cols="2" x-gap="10" item-responsive>
        <n-grid-item span="2 820:1 1025:1">
          <n-form-item label="文章标题" >
            <n-input ref="articleTitleRef" clearable v-model:value="articleForm.articles.articleTitle" placeholder="请输入文章标题" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2 820:1 1025:1">
          <n-form-item label="首图地址"  >
              <n-input  ref="articleImgRef" clearable style="width: 100%" v-model:value="articleForm.articles.articleImg" placeholder="首页图片，您也可以复制图片链接粘贴到此" />
            &nbsp;
              <n-spin size="small" :show="imgLoading">

              <n-upload
                  @before-upload="onBeforeUpload"
                  @finish="onFinish"
                  :show-file-list="false"
                  action="/api/uploadImg"
              >
                <n-button>上传首图</n-button>
              </n-upload>

              </n-spin>
            &nbsp;

          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2 820:1 1025:1">
          <n-form-item label="文章分类" >
            <n-select clearable filterable ref="articleClassifyRef"  placeholder="请选择分类(可前去分类管理添加)"  v-model:value="articleForm.classifyId" label-field="classifyName"
                      value-field="classifyId"  :options="[{'classifyName':'笔记','classifyId':'1231'}]" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2 820:1 1025:1">
          <n-form-item label="文章标签" >
            <n-select clearable multiple filterable ref="articleLabelRef"   placeholder="请选择标签(可前去分类管理添加)"  v-model:value="articleForm.labelId" label-field="labelName"
                      value-field="labelId" :options="[{'labelName':'前端','labelId':'1231'}]" />
          </n-form-item>
        </n-grid-item>
      </n-grid>
    </n-form>
<!--        封装的编辑器-->
        <MdEditorComponent :key="articleForm.articles.articleContent" :content="articleForm.articles.articleContent" @saveBtn="saveArticle(0)" ref="MdEditorComponentRef"  ></MdEditorComponent>
    <n-divider />
    <n-space justify="center">
      <n-button @click="router.back()" >
        取消
      </n-button>
      <n-button v-if="route.params.id=='add'" type="error" @click="saveArticle(0)">
        保存
      </n-button>
      <n-button v-if="route.params.id=='add'" type="success" @click="saveArticle(1)">
        发布
      </n-button>
   <n-button  v-if="route.params.id!='add'"  type="success" @click="saveArticle(2)">
        确认编辑
      </n-button>

    </n-space>
      </n-spin>
  </n-card>
    </n-gi>
  </n-grid>

</template>

<script setup lang="ts">
import {VaeStore} from "../store";
import {storeToRefs} from "pinia";
import {inject, onActivated, reactive, ref} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import {useDialog, useMessage, useNotification,InputInst} from "naive-ui";
const store = VaeStore();
import { Bus } from '../utils/Bus';
import * as imageConversion from "image-conversion";
import { FlowerSharp,CloseOutline,CaretForwardCircleOutline} from '@vicons/ionicons5';
const message = useMessage()
let {clientWidth,distanceToBottom,distanceToTop,userInfo,isdarkTheme} = storeToRefs(store);
const notification = useNotification();
const dialog = useDialog()
const router = useRouter()
const route = useRoute()
import axios from "axios";
const imgLoading=ref(false)
const showModalVideo=ref(false)
const editLoading=ref(false)
const loginShow=ref(false)
const articleTitleRef  = ref<InputInst | null>(null);
const mdeditorRef  = ref();
const VideoUrl  = ref('');
const CompressionSize  = ref(200);
const articleImgRef  = ref<InputInst | null>(null);
const articleClassifyRef  = ref<InputInst | null>(null);
const articleLabelRef  = ref<InputInst | null>(null);
const MdEditorComponentRef:any = ref(null);
const articleForm=reactive({
  articles:{
    articleTitle:'',
    articleImg:'',
    articleId:new Date().getTime(),
    articleContent:'',
    articleState:'',
  },
  classifyId:null,
  labelId:[],
})

//获取文章id，如果为add则为新增
const articleId=ref(route.params.id);
const update_ArticleMsg=()=>{
  editLoading.value=true;
  setTimeout(()=>{
    editLoading.value=false;
  },500)

  if(route.params.id!='add'){
    //如果是编辑，则通过文章id发送请求获取文章信息，赋值。
    articleForm.articles.articleState='';
    articleForm.articles.articleTitle='标题';
    articleForm.articles.articleImg='';
    articleForm.articles.articleId=JSON.parse(route.params.id as string);
    articleForm.articles.articleContent='查询到的文章内容';

  }else{
    //如果是新增则清空内容
      articleId.value='';
      articleForm.articles.articleState='';
      articleForm.articles.articleTitle='';
      articleForm.articles.articleImg='';
      articleForm.articles.articleId=new Date().getTime();
      articleForm.articles.articleContent='';
      articleForm.classifyId=null;
      articleForm.labelId=[];

  }
}
update_ArticleMsg();


//发布博客
const saveArticle=(val:number)=>{
  let {articles:{articleTitle,articleImg},classifyId,labelId}=articleForm;
  if(!articleTitle){message.error('请输入文章标题');articleTitleRef.value?.focus();return;};
  if(!articleImg){message.error('首图地址不能为空！');articleImgRef.value?.focus();return;};
  if(!classifyId){message.error('请选择分类！');articleClassifyRef.value?.focus();return;};
  if(labelId.length==0){message.error('请选择标签！');articleLabelRef.value?.focus();return;};
  if(labelId.length>3){message.error('标签最多只能选3项！');articleLabelRef.value?.focus();return;};
  let mdEditorContent = MdEditorComponentRef.value?.isValue();
  //内容是否有值
  if(mdEditorContent) {
    articleForm.articles.articleContent = mdEditorContent;
    //保存或发布文章
    if(val==0){
      articleForm.articles.articleState='0';
    }else if(val==1){
      articleForm.articles.articleState='1';
    }
    dialog[val==0?'error':'success']({
      title: val==0?'保存文章':val==1?'发布文章':'确认编辑',
      content: val==0?'该文章将在首页隐藏？':val==1?'该文章将在首页显示？':'是否保存当前编辑信息？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: () => {

        add_Article();

      }
    })

  }



}
//上传前
const onBeforeUpload=((file:any, fileList:any)=>{
  imgLoading.value=true;
  return new Promise((resolve, reject) => {
    //图片压缩
    imageConversion.compressAccurately(file.file.file, 200).then(res => {
      file.file.file = new File([res], file.file.file.name, { type: res.type, lastModified: Date.now() })
      resolve(file.file.file)
    })
  })


})
//上传后
const onFinish=((file:any)=>{
  imgLoading.value=false;
  let data =(file.event?.target as XMLHttpRequest).response;
  console.log(data)

})
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
              // 发送请求，获取图片地址
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
//新增博客
const add_Article=()=>{
  if(route.params.id!='add'){

message.info('参数：'+JSON.stringify(articleForm))
    //如果是编辑则走后端编辑方法
    console.log(articleForm)
  }else{
    //如果是新增则走后端新增方法
    console.log(articleForm)
    message.info('参数：'+JSON.stringify(articleForm))

  }

  //新增结束订阅bus中的方法，重新查询一下表格
    setTimeout(()=>{
      Bus.emit('add');
      //返回上一页
      router.back();
      notification.success({
        content: '成功信息',
        meta:  '成功信息',
        duration: 2500,
        closable: false,
      })
    },1000)

}



//滚动条回到原位
const scrollBy = inject<Function>('scrollBy');
const remeberScroll=ref(0);
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个状态保存
  remeberScroll.value = distanceToTop.value;
  next()
})
//   组件激活
onActivated(() => {
  if(articleId.value!=route.params.id){
    articleId.value=route.params.id;
    update_ArticleMsg();
  }

  scrollBy? scrollBy(remeberScroll.value):''
})
</script>

<style scoped>

</style>

<template>
<div>
  <BackgroundPlate title="随笔管理"  color="#03A9F4" height="150px"></BackgroundPlate>
  <n-grid :cols="8" >
  <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?6:8">
    <n-card class="margin-bottom10" :embedded="isdarkTheme" :bordered="!isdarkTheme">
      <template #header>
        <n-h2 prefix="bar" class="margin-bottom0px" align-text>
          随笔列表
        </n-h2>
      </template>

      <template #header-extra>
        <n-button strong secondary   @click="router.back()">
          返回
        </n-button>
      </template>
    </n-card>
    <n-card  :embedded="isdarkTheme" :bordered="!isdarkTheme">

<!--     搜索条件-->
      <n-form

          label-placement="left"
      >
        <n-space>

        <n-form-item label="随笔内容">
          <n-input clearable v-model:value="queryData.diaryContent" placeholder="请输入随笔内容" />
        </n-form-item>

          <n-form-item label="发布人" >
            <n-input clearable v-model:value="queryData.userName2" placeholder="请输入用户名称" />
          </n-form-item>
        <n-form-item label="日期" >
          <n-date-picker clearable   v-model:value="queryData.diaryDate"  type="date"    format="yyy-MM-dd"
                       />
        </n-form-item>
        <n-form-item>
            <n-button type="info" @click="searchBtn">
              查询
            </n-button>
          &nbsp;
            <n-button @click="emptyBtn">
              清空
            </n-button> &nbsp;
          <n-button  type="success" @click="addDiarysBtn">
            新增
          </n-button>


        </n-form-item>
        </n-space>

      </n-form>

      <n-spin :show="tableShow">

      <n-data-table
          :bordered="false"
          :single-line="false"
          :columns="columns"
          :data="tableData"
          :pagination="false"
          :scroll-x="1200"
      />
        <br>
      <n-pagination
          v-model:page="queryData.page"
          v-model:page-size="queryData.limit"
          :item-count="queryData.total"
          show-size-picker
         @update:page="pageChange"
          @update-page-size="pageSizeChange"
          :page-sizes="[
      {
        label: '10 每页',
        value: 10
      },
      {
        label: '20 每页',
        value: 20
      },
      {
        label: '50 每页',
        value: 50
      },
      {
        label: '100 每页',
        value: 100
      }]"
      >
        <template #suffix>
         共 {{queryData.total}} 条
        </template>
      </n-pagination>
      </n-spin>

    </n-card>
  </n-gi>
  </n-grid>
  <n-modal v-model:show="diarysShowModal"   :mask-closable="false" >
    <n-card
        :style="{'width':clientWidth>1025?'70%':'96%'}"
        :title="'正在'+(isUpdate?'编辑':'新增')+'随笔'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button tertiary @click="diarysShowModal=false">
          <template #icon>
            <n-icon size="22">
              <CloseOutline/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-spin :show="diarysLoading">

        <MdEditorComponent :content="diaryContent" @saveBtn="savediarys" ref="MdEditorComponentRef"></MdEditorComponent>
        <n-divider/>

        <n-space justify="center">
          <n-button @click="diarysShowModal=false" >
            取消
          </n-button>
          <n-button type="success" @click="savediarys()">
            {{isUpdate?"确认编辑":"发布"}}
          </n-button>

        </n-space>
      </n-spin>
    </n-card>
  </n-modal>

</div>
</template>

<script setup lang="ts">
import {VaeStore} from "../../../store";
import  BackgroundPlate from '../../background/BackgroundPlate.vue'
import {storeToRefs} from "pinia";
import {inject, onActivated, reactive, ref, h,} from "vue";
import {onBeforeRouteLeave, useRouter} from "vue-router";
import {CloseOutline} from '@vicons/ionicons5';
import  MdEditorComponent from '../../MdEditor/MdEditorComponent.vue'

import {NButton, useMessage,useDialog, useNotification} from 'naive-ui'

const tableShow=ref(false);
const diaryContent=ref('');
const diaryID=ref('');
const diarysShowModal=ref(false);
const diarysLoading=ref(false);
const isUpdate=ref(false);
const mdeditorRef  = ref();
const message = useMessage()

const router = useRouter()
const dialog = useDialog()
const notification = useNotification();
import axios from "axios";
import * as imageConversion from "image-conversion";

const showModalVideo=ref(false)
const loginShow=ref(false)
const VideoUrl  = ref('');
const CompressionSize  = ref(200);
const MdEditorComponentRef:any = ref(null);

const queryData=reactive({
  diaryContent:'',
  diaryDate:null,
  userName2:null,
  limit:10,
  total:0,
  page:1,
})
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,userInfo,isdarkTheme} = storeToRefs(store);

//清空
const emptyBtn=()=>{
  queryData.userName2=null;
  queryData.diaryContent='';
  queryData.diaryDate=null;
}


const pageChange=(page: number)=>{
  queryData.page=page;
  get_AadminDiarysAll();

};
const pageSizeChange=(limit: number)=>{
  queryData.page=limit;
  queryData.page=1;
  get_AadminDiarysAll();

}

const columns =[
  {
    title: '序号',
    width:'60',
    render (row:any,rowIndex:number) {
      return rowIndex+1
    }
  },
    {
      title: '发布人',
      width:'70',
      ellipsis: true,
      key: 'userName',
    },

    {
      title: '随笔内容',
      key: 'diaryContent',
      ellipsis: true,

    },  {
    title: '发布日期',
    width:'170',
    key: 'diaryDate'
  },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 130,
      render (row:any) {
        let {id,diaryContent}=row;
        return [h(
            NButton,
            {
              type:'info',
              strong:true,
              secondary:true,
              size: 'small',
              onClick: () => {
                updateBtn(id,diaryContent)
              }
            },
            { default: () => '编辑' }
        ),  h(
            NButton,
            {
              style:'margin:0px 5px',
              type:'error',
              strong:true,
              secondary:true,
              size: 'small',
              onClick: () => {
                deleteBtn(row)
              }
            },
            { default: () => '删除' }
        )]
      }
    }
  ]

const tableData= ref<any>([])
//查询
const searchBtn=()=>{
  queryData.page=1;
  get_AadminDiarysAll();
}
//获取所有
const get_AadminDiarysAll=()=>{
  //发送请求
  tableData.value=[{id:'1312',userName:'APPLE',diaryContent:'这是内容'}];
  queryData.total=100;

}
get_AadminDiarysAll();
//编辑
const updateBtn=(id:number,Content:string)=>{
  isUpdate.value=true;
  diaryContent.value=Content;
  diarysShowModal.value=true;
  diaryID.value=id.toString();
}
//新增
const addDiarysBtn=()=>{
  isUpdate.value=false;
diaryContent.value='';
  diarysShowModal.value=true;
}
//保存随笔
const savediarys=()=>{
  let mdEditorContent = MdEditorComponentRef.value?.isValue();
  //有值
  if(mdEditorContent){
    diaryContent.value=mdEditorContent;
    //判断是编辑还是新增
    if(isUpdate.value){
      upd_Diarys();
    }else{
      add_Diarys();

    }
  }

}
const add_Diarys=()=>{
  diarysLoading.value=true;
    //调用新增方法
  console.log(diaryContent.value)
  message.info('参数:'+diaryContent.value)
  setTimeout(()=>{
    diarysLoading.value=false;

  },1000)
};
const upd_Diarys=()=>{
  diarysLoading.value=true;
  //调用编辑方法
  message.info('参数:'+diaryContent.value)
  console.log(diaryContent.value)
  setTimeout(()=>{
    diarysLoading.value=false;

  },1000)
}

//删除
const deleteBtn=(row:any)=>{
  dialog.error({
    title: `删除随笔`,
    content: `[xxx]于[xxxx]发布的随笔将被删除，是否继续？`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      message.info('参数：'+JSON.stringify(row))

      //执行删除方法
      console.log(row)
  }})

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
  scrollBy? scrollBy(remeberScroll.value):''
})
</script>

<style scoped>

</style>

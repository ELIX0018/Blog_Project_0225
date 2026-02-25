<template>
<div>
  <BackgroundPlate title="文章管理"  color="#5e35b1" height="150px"></BackgroundPlate>
  <n-grid :cols="8" >
  <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?6:8">
    <n-card class="margin-bottom10" :embedded="isdarkTheme" :bordered="!isdarkTheme">
      <template #header>
        <n-h2 prefix="bar" class="margin-bottom0px" align-text>
          文章列表
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

        <n-form-item label="内容">
          <n-input clearable v-model:value="queryData.articleContent" placeholder="请输入文章内容或标题" />
        </n-form-item>
        <n-form-item label="分类" >
          <n-select clearable style="width: 180px"  placeholder="请选择分类"  v-model:value="queryData.classifyId" label-field="classifyName"
                    value-field="classifyId" :options="classifyOptions" />
        </n-form-item>
          <n-form-item label="状态" >
            <n-select clearable style="width: 180px"  placeholder="请选择状态"  v-model:value="queryData.articleState" :options="StateOptions" />
          </n-form-item>
        <n-form-item label="日期" >
          <n-date-picker clearable   v-model:value="queryData.articleDate"  type="date"    format="yyy-MM-dd"
                       />
        </n-form-item>
        <n-form-item>
            <n-button type="info" @click="searchBtn">
              查询
            </n-button>
          &nbsp;
            <n-button @click="emptyBtn">
              清空
            </n-button>
          &nbsp;
            <n-button  type="success" @click="addArticle">
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
          :scroll-x="1000"
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


</div>
</template>

<script setup lang="ts">
import {VaeStore} from "../../../store";
import  BackgroundPlate from '../../background/BackgroundPlate.vue'
import {storeToRefs} from "pinia";
import {inject, onActivated, reactive, ref, h,watch,onBeforeUnmount} from "vue";
import {onBeforeRouteLeave, useRouter} from "vue-router";
import  {getChinese,formatDate} from  '../../../utils/function'
import { Bus } from '../../../utils/Bus';
import {NButton, useMessage, NTag, useDialog, useNotification} from 'naive-ui'
const tableShow=ref(false);
const classifyOptions=ref([]);
const router = useRouter()
const dialog = useDialog()
const notification = useNotification();
const message = useMessage()

const   StateOptions=[
  {
    label: '已发布',
    value: '1'
  },   {
    label: '未发布',
    value: '0'
  }
]

const queryData=reactive({
  articleContent:'',
  articleDate:null,
  classifyId:null,
  articleState:null,
  limit:10,
  total:0,
  page:1,
})
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,userInfo,isdarkTheme} = storeToRefs(store);
//清空
const emptyBtn=()=>{
  queryData.articleState=null;
  queryData.classifyId=null;
  queryData.articleContent='';
  queryData.articleDate=null;

}


const pageChange=(page: number)=>{
  queryData.page=page;
  get_ArticlesAll();

};
const pageSizeChange=(limit: number)=>{
  queryData.page=limit;
  queryData.page=1;
  get_ArticlesAll();

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
      title: '标题',
      key: 'articleTitle',
      ellipsis: true
    },
    {
      title: '内容',
      key: 'articleContent',
      ellipsis: true,
      render (row:any) {
        return getChinese(row.articleContent)
      }
    },
    {
      title: '状态',
      width:'80',
      key: 'articleState',
      render (row:any) {
        let {articleState}=row;
        return  h(
            NTag,
            {
              style: {
                marginRight: '6px'
              },
              type: !articleState?'error':'success',
              bordered: false
            },
            {
              default: () => articleState?'已发布':'未发布'
            }
        )
      }
    },   {
      title: '分类',
    width:'90',
      key: 'classifyName',

    },   {
      title: '日期',
    width:'190',
      key: 'articleDate'
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 240,
      render (row:any) {
        return [h(
            NButton,
            {
              ghost: true,
              size: 'small',
              onClick: () => {
                detailsBtn(row.articleId);
              }
            },
            { default: () => '查看' }
        ), h(
            NButton,
            {
              style:'margin:0px 5px',
              type:'info',
              ghost: true,
              size: 'small',
              onClick: () => {
                updateBtn(row.articleId);
              }
            },
            { default: () => '编辑' }
        ), h(
            NButton,
            {
              style:'margin:0px 5px 0px 0px',
              type:'warning',
              ghost: true,
              size: 'small',
              onClick: () => {
                statusBtn(row);
              }
            },
            { default: () => '状态' }
        ), h(
            NButton,
            {
              type:'error',
              ghost: true,
              size: 'small',
              onClick: () => {
               deleteBtn(row);
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
  get_ArticlesAll();
}
//获取所有文章
const get_ArticlesAll=()=>{
  tableShow.value=true;
 //发送获取文章请求
  console.log(queryData)
  //假数据
  tableData.value=[{articleTitle:'标题',articleId:'123',articleContent:'12312'}];
  queryData.total=1000;

  setTimeout(()=>{
    tableShow.value=false;
  },1000)
}
get_ArticlesAll();

//发布订阅
Bus.on('add', ()=>{
  get_ArticlesAll();

});
//销毁
onBeforeUnmount(()=>{
  Bus.off('add',get_ArticlesAll);
})

//新增文章
const addArticle=()=>{
  router.push({ path: `/articleEditor/add` });

};


//查询详情
const detailsBtn=(id:string)=>{
  router.push({ path: `/articleDetails/${id}` });
}
//编辑
const updateBtn=(id:string)=>{
  router.push({ path: `/articleEditor/${id}` });


}
//删除
const deleteBtn=(row:any)=>{
  dialog.error({
    title:'删除文章',
    content:`文章[xxx]的所有信息都将删除！是否确认？`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      message.info('参数：'+JSON.stringify(row))

      // 删除方法
      console.log(row)
    }
  })
}//修改状态
const statusBtn=(row:any)=>{
  dialog['success']({
    title: "修改为未发布",
    content: `该文章将在首页隐藏或显示？`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      message.info('参数：'+JSON.stringify(row))

      //调用后台接口
      console.log(row)

    }
  })
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

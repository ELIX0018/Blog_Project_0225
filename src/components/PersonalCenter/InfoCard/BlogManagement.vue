<template>
  <div>
    <BackgroundPlate title="网站管理"  color="#f4511e" height="150px"></BackgroundPlate>
    <n-grid :cols="8" >
      <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?6:8">
        <n-card class="margin-bottom10" :embedded="isdarkTheme" :bordered="!isdarkTheme">
          <template #header>
            <n-h2 prefix="bar" class="margin-bottom0px" align-text>
              网站列表
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

              <n-form-item label="网站名称">
                <n-input clearable v-model:value="queryData.labelName" placeholder="请输入网站名称" />
              </n-form-item>
              <n-form-item label="创建人" >
                <n-input clearable v-model:value="queryData.userName2" placeholder="请输入创建者用户名" />

              </n-form-item>

              <n-form-item label="日期" >
                <n-date-picker clearable   v-model:value="queryData.labelDate"  type="date"    format="yyy-MM-dd"
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
                <n-button type="success" @click="addBtn">
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
    <!--  编辑-->
    <n-modal v-model:show="editShowModal">
      <n-card
          :style="{'width':clientWidth>1025?'500px':'96%'}"
          :title="isupdate?'正在编辑['+updateName+']网站':'正在新增网站'"
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
        <n-spin :show="editLoading">

          <n-form  label-width="80px"  label-placement="left">
            <n-form-item-row label="网站名称">
              <n-input
                  ref="labelNameRef"
                  v-model:value="updateForm.labelName"
                  placeholder="请输入网站名称。"

              />
            </n-form-item-row>
            <n-form-item-row label="网站描述">
              <n-input
                  ref="labelDescribeRef"
                  v-model:value="updateForm.labelDescribe"
                  placeholder="请输入网站描述。"
                  type="textarea"
                  :autosize="{
                            minRows: 2,
                            maxRows: 5
                          }"
              />
            </n-form-item-row>
          </n-form>
          <n-space justify="center">

            <n-button @click="editShowModal=false">
              取消
            </n-button>&nbsp;
            <n-button type="info" @click="submitBtn">
              确定
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
import {inject, onActivated, reactive, ref, h,watch,onBeforeUnmount} from "vue";
import {onBeforeRouteLeave, useRouter} from "vue-router";
import { CloseOutline,} from '@vicons/ionicons5';
import { v4 as uuidv4 } from "uuid";

import {NButton, useMessage, NGradientText, useDialog, useNotification, InputInst} from 'naive-ui'
const tableShow=ref(false);
const editLoading=ref(false);
const editShowModal=ref(false);
const isupdate=ref(false);
const updateName=ref( '');

const updateForm=ref( {
  labelName:'',
  labelDescribe:'',
  labelId:'',
});
const message = useMessage()

const labelNameRef = ref<InputInst | null>(null)

const router = useRouter()
const dialog = useDialog()
const notification = useNotification();


const queryData=reactive({
  labelName:null,
  labelDate:null,
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
  queryData.labelName=null;
  queryData.labelDate=null;

}


const pageChange=(page: number)=>{
  queryData.page=page;
  get_AadminLabelsAll();

};
const pageSizeChange=(limit: number)=>{
  queryData.page=limit;
  queryData.page=1;
  get_AadminLabelsAll();

}

const columns =[
  {
    title: '序号',
    width:'60',
    render (row:any,rowIndex:number) {
      return rowIndex+1
    }
  }, {
    title: '网站名称',
    ellipsis: true,
    width:'170',
    key: 'labelName'
  },
  {
    title: '创建人',
    width:'70',
    ellipsis: true,
    render (row:any) {
      let {qq,qqName,userName}=row;
      return  h(
          NGradientText,
          {
            type: qq==0?'info':'error',
          },
          {
            default: () => qq==0?userName:qqName
          }
      )
    }
  },{
    title: '网站描述',
    ellipsis: true,
    key: 'labelDescribe'
  },{
    title: '创建时间',
    width: '180',
    key: 'labelDate'
  },

  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 160,
    render (row:any) {
      return [h(
          NButton,
          {
            style:'margin:0px 5px',
            type:'info',
            strong:true,
            secondary:true,
            size: 'small',
            onClick: () => {
              editBtn(row)
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

const tableData= ref<any>([]);
//查询
const searchBtn=()=>{
  queryData.page=1;
  get_AadminLabelsAll();
}
//获取所有
const get_AadminLabelsAll=()=>{
  tableShow.value=true;
  tableData.value=[{labelName:'网站',
    labelDescribe:'网站描述'}];
  queryData.total=100;
  setTimeout(()=>{
    tableShow.value=false;
  },1000)
}
get_AadminLabelsAll();

//新增
const addBtn=()=>{
  updateForm.value.labelDescribe='';
  updateForm.value.labelName='';
  updateForm.value.labelId=uuidv4();
  editShowModal.value=true;
  isupdate.value=false;

}
//编辑
const editBtn=(row:any)=>{
  updateName.value=row.labelName;
  updateForm.value={...row};
  editShowModal.value=true;
  isupdate.value=true;

}
//确认
const submitBtn=()=>{
  let {labelName}=updateForm.value;
  if(!labelName){
    message.error('请输入网站名称');
    labelNameRef.value?.focus();
    return;
  }
  message.info('参数:'+JSON.stringify(updateForm.value))

  //判断新增还是编辑
  if(isupdate.value){
    update_AadminLabels();

  }else{
    add_AadminLabels();
  }

}
const update_AadminLabels=()=>{
  console.log(updateForm.value)
}
const add_AadminLabels=()=>{
  console.log(updateForm.value)
}

//删除
const deleteBtn=(row:any)=>{
  let {labelName,labelId}=row;
  dialog.error({
    title: `删除网站`,
    content: `是否删除[${labelName}]网站？`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      message.info('参数:'+JSON.stringify(row))

      //执行删除方法
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

<template>
<!--  赞赏页面-->
  <BackgroundPlate title="赞 赏" description="并非乞讨者，但也不拒绝赞赏，感谢您对本站的支持！" color="#e53935"></BackgroundPlate>
  <n-grid :cols="8" >
    <n-gi style="min-height: 100vh" :offset="clientWidth>1075?1:0" :span="clientWidth>1075?6:8">
      <n-card   :embedded="isdarkTheme" :bordered="!isdarkTheme">

        <n-thing>
          <template #header-extra>
            <n-button strong secondary size="small"   @click="router.back()">
              返回
            </n-button>
          </template>
          <template #avatar>
            <Starport   port="my-id"  style="width: 50px;height: 50px;background: none" >
              <myImg></myImg>
            </Starport>
          </template>
          <template #header>
            <n-text tag="div">Zhang Apple</n-text>
          </template>
          <template  #description>
            🧣感谢您对本站的喜爱和支持，您的赞赏将是本站不断前进的动力！
          </template>
          打赏赞助时请尽量留下备注，以让我知道你是谁~如果当时忘记加备注，可在本博客留言说明。
          赞赏名单不定期手动更新，可能有延迟。如长时间未更新可在本博客留言提醒，感谢您的支持❤️。
        </n-thing>
        <template #action>
          <n-space>
            <n-popover  trigger="click">
              <template #trigger>
                <n-button size="small" type="info"  strong secondary>支付宝赞赏</n-button>
              </template>
              <n-image
                  width="100"
                  src="https://img.zhangpingguo.com/VAE_Article_Head/vae/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230228160833.png"
              />

            </n-popover>
            <n-popover  trigger="click">
              <template #trigger>
                <n-button size="small" type="success"  strong secondary>微信赞赏</n-button>
              </template>
              <n-image
                  width="100"
                  src="https://img.zhangpingguo.com/VAE_Article_Head/vae/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230228160830.png"
              />

            </n-popover>


          </n-space>

        </template>
      </n-card>
      <br>
      <n-card   :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <template #header>
          <n-h2 prefix="bar" class="margin-bottom0px" align-text>
            赞赏名单
          </n-h2>
        </template>
        <n-spin :show="tableShow">

          <n-data-table
              :bordered="false"
              :columns="columns"
              :data="tableData"
              :pagination="false"

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
</template>

<script setup lang="ts">
import BackgroundPlate from '../components/background/BackgroundPlate.vue'
import {VaeStore} from "../store";
import {storeToRefs} from "pinia";
import {inject, h, reactive, ref, watch} from "vue";
import {NButton, NGradientText, NTag, useMessage, useNotification} from "naive-ui";
import {useRouter} from "vue-router";
const store = VaeStore();
let {clientWidth,distanceToBottom,distanceToTop,isdarkTheme} = storeToRefs(store);
const message = useMessage()
const tableShow=ref(false);
const notification = useNotification();
const router = useRouter()
const queryData=reactive({
  limit:10,
  total:0,
  page:1,
})
const columns =[
  {
    title: '序号',
    width:'60',
    render (row:any,rowIndex:number) {
      return rowIndex+1
    }
  }, {
    title: '昵称',
    width:'100',
    resizable: true,
    key: 'name'
  },{
    title: '金额',
    width:'90',
    key: 'money',
    render (row:any) {
      return  h(
          NGradientText,
          {
            type: 'error',
          },
          {
            default: () =>row.money
          }
      )
    }
  },
  {
    title: '备注',
    key:'leave',
    resizable: true,
  },
  {
    title: '支付方式',
    width:'120',
    key:'leave',
    resizable: true,
    render (row:any) {
      let {type}=row;
      return  h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: type=='tenpay'?'warning':type=='alipay'?'info':type=='wxpay'?'success':'error',
            bordered: false
          },
          {
            default: () => type=='wxpay'?'微信':type=='alipay'?'支付宝':type=='tenpay'?'财付通':type=='qqpay'?'QQ钱包':'转账',
          }
      )
    }
  },{
    title: '时间',
    width: '180',
    key: 'date'
  },

]

const tableData= ref<any>([])

//获取所有
const select_Sponsor=()=>{
  tableData.value=[{date:'20240108',money:'10000000',name:'老马'},{date:'20240108',money:'1000000',name:'小马'}];
  queryData.total=1000;
}
select_Sponsor();

const pageChange=(page: number)=>{
  queryData.page=page;
  select_Sponsor();

};
const pageSizeChange=(limit: number)=>{
  queryData.page=limit;
  queryData.page=1;
  select_Sponsor();

}
//滚动条回到原位
const scrollBy = inject<Function>('scrollBy');

scrollBy? scrollBy(0):''

</script>

<style scoped>

</style>

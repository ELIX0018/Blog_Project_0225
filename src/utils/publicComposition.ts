//公共组件方法封装
import {computed} from "vue";
import {VaeStore} from "../store";
import {storeToRefs} from "pinia";
const store = VaeStore();
let {clientWidth} = storeToRefs(store);

export default function (){
    //响应式调整页面布局-文章详情
    const ngiOffsetValue = computed(() => {
        return clientWidth.value>=1075?clientWidth.value>=1900?2:1:0;
    })
    const ngiSpanValue = computed(() => {
        return clientWidth.value>=1075?5:10;
    })

    return {ngiOffsetValue,ngiSpanValue}
}



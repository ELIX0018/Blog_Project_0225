import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
//注册路由
import router from './router'
//注册pinia
import {createPinia} from 'pinia'
//背景动画
import Particles from "@tsparticles/vue3";
// @ts-ignore
import { loadFull } from "tsparticles";
import StarportPlugin from 'vue-starport'
//token
import {getCookie} from './utils/auth'

//kinesis动画
// @ts-ignore
import VueKinesis from "vue-kinesis"
import { MotionPlugin } from '@vueuse/motion'
import UUID from 'vue3-uuid'
import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'
const store=createPinia()
import { VaeStore } from './store'

//路由前置守卫
router.beforeEach((to,from,next)=>{
    //设置网页标题
    document.title=to.meta.title as string;
    //导航菜单选中
    VaeStore().setactiveKey(to.name as string);
    //访问指定路由，判断是否登录，未登录则跳转首页
    if(!getCookie('appleToken')){
        if( ['personalCenter', 'myArticle',  'articleEditor',].includes(to.name as string)){
            next('/home');
        }
    }
    next();
})


createApp(App).use(router).use(store).use(VueKinesis).use(MotionPlugin).use(UndrawUi).use(UUID).use(Particles, {
    init: async engine => {
        await loadFull(engine);
    },
}).use(StarportPlugin({ keepAlive: true })).mount('#app')

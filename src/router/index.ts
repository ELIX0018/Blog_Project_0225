import {createRouter,createWebHistory,createWebHashHistory,RouteRecordRaw} from "vue-router"

//配置路由
// @ts-ignore
// @ts-ignore
const routes:Array<RouteRecordRaw>=[
    {
        path:"/",
        redirect:'home'
    }, {
        path:"/home",
        name:"home",
        component:()=>import('../page/Home.vue'),
        meta: {
            title:"首页",
            keepAlive: true,
           }
    },
    {
        path:"/article",
        name:"article",
        component:()=>import('../page/Article.vue'),
        meta: {
            title:"文章",
            keepAlive: true,
           }
    },{
        path:"/diary",
        name:"diary",
        component:()=>import('../page/Diary.vue'),
        meta: {
            title:"随笔一记",
            keepAlive: true,
           }
    },{
        path:"/guestbook",
        name:"guestbook",
        component:()=>import('../page/Guestbook.vue'),
        meta: {
            title:"留言版",
            keepAlive: true,
           }
    },{
        path:"/friendLink",
        name:"friendLink",
        component:()=>import('../page/FriendLink.vue'),
        meta: {
            title:"友情链接",
            keepAlive: true,
           }
    },{
        path:"/message",
        name:"message",
        component:()=>import('../page/Message.vue'),
        meta: {
            title:"关于",
            keepAlive: false,
           }
    },
      {
        path:"/sponsor",
        name:"sponsor",
        component:()=>import('../page/Sponsor.vue'),
        meta: {
            title:"赞赏",
            keepAlive: false,
           }
    },{
        path:"/personalCenter",
        name:"personalCenter",
        component:()=>import('../page/PersonalCenter.vue'),
        meta: {
            title:"个人中心",
            keepAlive: true,
           }
    },{
        path:"/articleDetails/:id",
        name:"articleDetails",
        component:()=>import('../components/Article/ArticleDetails.vue'),
        meta: {
            title:"文章信息",
            keepAlive: true,
        }
    },{
        path:"/personalDetails/:id",
        name:"personalDetails",
        component:()=>import('../page/personalDetails.vue'),
        meta: {
            title:"个人信息",
            keepAlive: true,
        }
    },{
        path:"/myArticle",
        name:"myArticle",
        component:()=>import('../components/PersonalCenter/InfoCard/MyArticle.vue'),
        meta: {
            title:"文章管理",
            keepAlive: true,
        }
    },{
        path:"/myUsers",
        name:"myUsers",
        component:()=>import('../components/PersonalCenter/InfoCard/MyUsers.vue'),
        meta: {
            title:"用户管理",
            keepAlive: true,
        }
    },{
        path:"/myComment",
        name:"myComment",
        component:()=>import('../components/PersonalCenter/InfoCard/MyComment.vue'),
        meta: {
            title:"评论管理",
            keepAlive: true,
        }
    },{
        path:"/myDiarys",
        name:"myDiarys",
        component:()=>import('../components/PersonalCenter/InfoCard/MyDiarys.vue'),
        meta: {
            title:"随笔管理",
            keepAlive: true,
        }
    },{
        path:"/myGuestBook",
        name:"myGuestBook",
        component:()=>import('../components/PersonalCenter/InfoCard/MyGuestBook.vue'),
        meta: {
            title:"留言管理",
            keepAlive: true,
        }
    },{
        path:"/myLinks",
        name:"myLinks",
        component:()=>import('../components/PersonalCenter/InfoCard/MyLinks.vue'),
        meta: {
            title:"友链管理",
            keepAlive: true,
        }
    },{
        path:"/myClassify",
        name:"myClassify",
        component:()=>import('../components/PersonalCenter/InfoCard/MyClassify.vue'),
        meta: {
            title:"分类管理",
            keepAlive: true,
        }
    },{
        path:"/blogManagement",
        name:"blogManagement",
        component:()=>import('../components/PersonalCenter/InfoCard/BlogManagement.vue'),
        meta: {
            title:"网站管理",
            keepAlive: true,
        }
    },{
        path:"/myLabel",
        name:"myLabel",
        component:()=>import('../components/PersonalCenter/InfoCard/MyLabel.vue'),
        meta: {
            title:"标签管理",
            keepAlive: true,
        }
    },{
        path:"/myPayment",
        name:"myPayment",
        component:()=>import('../components/PersonalCenter/InfoCard/MyPayment.vue'),
        meta: {
            title:"赞助管理",
            keepAlive: true,
        }
    },{
        path:"/articleEditor/:id",
        name:"articleEditor",
        component:()=>import('../page/ArticleEditor.vue'),
        meta: {
            title:"文章操作",
            keepAlive: true,
        }
    }
]

const router=createRouter({
    history:createWebHashHistory(),
    routes
})
//导出
export default router;

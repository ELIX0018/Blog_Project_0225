import {defineStore} from 'pinia'
import {Names} from './store-name'
import {getCookie} from  '../utils/auth'

export const VaeStore=defineStore(Names.StoreName,{
    state:()=>{

        return{
            clientWidth:0,//屏幕宽
            isdarkTheme:localStorage.getItem('vueuse-color-scheme')=='dark',//主题，白 黑
            isPC:false,//是否pc端
            clientHeight:0,//屏幕高
            distanceToBottom:0,//滚动条距离底部
            distanceToTop:0,//滚动条距离上部
            activeKey:"",//当前页面
            address:"未知",//当前用户地址
            appleToken:getCookie('appleToken')||"",//token
            userInfo:getCookie('userInfo')?JSON.parse(getCookie('userInfo')):{
                token:'',
                userHead:'',
                userId:'',
                userName:'',
                userPassword:'',
                userPowerId:'',
                qqId:'',
                qqName:'',
                qqImg:'',
            },
        }

    },
    //类似computed 修饰一些值
    getters:{
        getClientWidth():number{
           return this.clientWidth
        }
    },
    //methods 可以同步异步 提交state
    actions:{
        setAddress(address:string){
            this.address=address;

        }, setclientWidth(num:number){
            this.clientWidth=num;
            this.isPC= num>1025? true:false;

        }, setdistanceToBottom(num:number){
            this.distanceToBottom=num;


        },setdistanceToTop(num:number){
            this.distanceToTop=num;


        },
        setclientHeight(num:number){
            this.clientHeight=num
        },
        setactiveKey(key:string){
            this.activeKey=key
        },
        setdarkTheme(darkTheme:boolean){
            this.isdarkTheme=darkTheme
        },
        setuserInfo(obj:any){
            this.userInfo=obj
        },
        setappleToken(token:string){
            this.appleToken=token
        }
    }


})

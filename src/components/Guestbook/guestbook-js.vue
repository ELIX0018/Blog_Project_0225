<template>
<!--  评论留言组件
推荐您直接访问作者官网查看如何使用：https://undraw.gitee.io/undraw-ui/
-->
  <div >
    <u-comment
        style="padding: 0px"
      :config="config"
      @submit="submit"
      @like="like"
      @reply-page="replyPage"
      @get-user="getUser"
      @remove="remove"
      @report="report"
    >

      <template #info="scope" >

          <div class="user-content">

                <span class="name" >{{ scope.user.username }}  </span>

                <span blank="true" class="rank">&nbsp;
                 <n-tag  size="small"  type="error" :bordered="false">
                    站长
                  </n-tag>


                </span>
            &nbsp;
            <n-text depth="3" style="font-size: 8px">
              <n-tag size="small"  :bordered="false">
                <template #icon>
                  <n-icon :component="GolfOutline" />
                </template>
                {{ scope.address }}

              </n-tag>

            </n-text>
            &nbsp;
            <n-text depth="3" :style="{float: clientWidth>660?'right':''}">
                {{scope.createTime}}
            </n-text>


        </div>
      </template>
    </u-comment>

  </div>
</template>

<script setup lang="js">
import {reactive, ref, watch, onMounted} from 'vue'
import { UToast } from 'undraw-ui'
import {PawOutline} from '@vicons/ionicons5'
import emoji from '../../assets/emoji'
import { getGuestbookApi, createGuestbookApi } from '../../utils/api'
//获取用户浏览器信息方法
//import {userAgentObj} from '../../utils/win'
import { v4 as uuidv4 } from "uuid";
import {GolfOutline} from '@vicons/ionicons5'
import {VaeStore} from "../../store";
import {storeToRefs} from "pinia";
import {useMessage} from "naive-ui";
const pageData=reactive({page:1,limit:8,apple:'1'});
const loadingCard=ref(true);
const loadingEnd=ref(false);
const noData=ref(false);
const message = useMessage()
const store = VaeStore();
let {clientWidth,distanceToTop,isdarkTheme,distanceToBottom,userInfo,address} = storeToRefs(store);


defineOptions({
  name: 'comment'
})
let {userName, userPassword,qqId,userId,userPowerId} = userInfo.value;

const config = reactive({
  user: {
    id: userInfo.value.userId,
    username:userInfo.value.userName,
    avatar: userInfo.value.userHead,
    userPowerId: userInfo.value.userPowerId,
    // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
    likeIds: [userInfo.value.userId, '', 3]
  },
  emoji: emoji,
  comments: [],
  total: 10
})




// 请求获取用户详细信息
const getUser = (uid, show) => {

}
//获取所有留言
const get_LeaveAll=async()=>{
  try {
    loadingCard.value = true;
    const response = await getGuestbookApi({
      page: pageData.page,
      limit: pageData.limit
    });
    
    if (response.data.ec === '0') {
      config.comments = response.data.data.comments;
      config.total = response.data.data.pagination.total;
      
      // 检查是否还有更多数据
      if (response.data.data.comments.length < pageData.limit) {
        loadingEnd.value = true;
      }
    } else {
      message.error('获取留言失败: ' + response.data.em);
    }
  } catch (error) {
    message.error('网络错误，无法获取留言');
    console.error('获取留言失败:', error);
  } finally {
    loadingCard.value = false;
  }
}

// 组件挂载时获取留言
onMounted(() => {
  get_LeaveAll();
});

//监听滚动条
watch(() => distanceToBottom.value, (newValue, oldValue) => {
  //如果滚动到了底部
  if(newValue<60 &&  !loadingCard.value && !loadingEnd.value){
    pageData.page++;
    get_LeaveAll();
  }
});


// 提交留言事件
const submit = async ({ content, parentId, files, finish, reply, mentionList}) => {
  try {
    let contentImg = files.map(e => createObjectURL(e)).join(', ')
    
    const response = await createGuestbookApi({
      content: content,
      parentId: parentId
    });
    
    if (response.data.ec === '0') {
      const newComment = response.data.data;
      // 格式化新留言的数据结构
      const formattedComment = {
        id: newComment.id,
        parentId: newComment.parentId,
        uid: newComment.userId,
        address: newComment.address,
        content: newComment.content,
        likes: newComment.likes,
        createTime: newComment.createTime,
        contentImg: newComment.contentImg,
        user: {
          username: newComment.username,
          avatar: newComment.avatar,
          level: newComment.userPowerId >= 999 ? 6 : 1,
          homeLink: `1`
        },
        reply: []
      }
      
      finish(formattedComment)
      UToast({ message: '留言成功!', type: 'success' })
      
      // 重新加载留言列表
      pageData.page = 1;
      loadingEnd.value = false;
      get_LeaveAll();
    } else {
      UToast({ message: '留言失败: ' + response.data.em, type: 'error' })
      finish(null)
    }
  } catch (error) {
    console.error('提交留言失败:', error);
    UToast({ message: '网络错误，留言失败', type: 'error' })
    finish(null)
  }
}

// 删除评论事件
const remove = (id, finish) => {
  console.log('删除评论: ' + id)
  setTimeout(() => {
    finish()
    alert(`删除成功: ${id}`)
  }, 200)
}

//举报用户事件
const report = (id, finish) => {
  console.log('举报用户: ' + id)
  setTimeout(() => {
    finish()
    alert(`举报成功: ${id}`)
  }, 200)
}

// 点赞按钮事件
const like = (id, finish) => {
  console.log('点赞: ' + id)
  console.log(id)
  setTimeout(() => {
    finish()
  }, 200)
}

// 分页插件
const page = (pageNum, pageSize, arr) => {
  var skipNum = (pageNum - 1) * pageSize
  var newArr =
    skipNum + pageSize >= arr.length ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize)
  return newArr
}

// 创建文件URL
const createObjectURL = (file) => {
  return URL.createObjectURL(file);
}

//回复分页
const replyPage = async (parentId, pageNum, pageSize, finish) => {
  try {
    const response = await getGuestbookApi({
      page: pageNum,
      limit: pageSize
    });
    
    if (response.data.ec === '0') {
      // 过滤出当前留言的回复
      const replies = response.data.data.comments.filter(comment => 
        comment.parentId === parentId
      );
      
      const tmp = {
        total: replies.length,
        list: page(pageNum, pageSize, replies)
      }
      finish(tmp)
    } else {
      finish({ total: 0, list: [] })
    }
  } catch (error) {
    console.error('获取回复失败:', error);
    finish({ total: 0, list: [] })
  }
}

</script>

<style lang="scss" scoped>
.user-card {
  display: flex;
  .user-content {
    position: relative;
    flex: 1;
    margin-left: 16px;

    .user-info {
      .username {
        display: flex;
        align-items: center;
        text-decoration: none;
        .name {
          max-width: 10rem;
          font-weight: 500;
          font-size: 15px;
          color: #252933;
          line-height: 32px;
          margin-right: 4px;
        }
      }
    }
    .social-info {
      margin-bottom: 10px;
      a {
        text-decoration: none;
      }
      a:not(:first-child) {
        margin-left: 18px;
      }
      a span:last-child {
        margin-left: 3px;
        color: #9499a0;
      }
    }
  }
}
</style>

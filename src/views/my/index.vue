<template>
  <div class="my-container">
    <!-- 登陆状态 -->
    <van-cell-group v-if="user" class="my-info">
      <!-- 基本信息 -->
      <van-cell
        title="单元格"
        value="内容"
        center
        class="base-info"
        :border="false"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div slot="title" class="name">{{currentUser.name}}</div>
        <van-button
          class="update-btn"
          size="small"
          round
        >编辑资料</van-button>
      </van-cell>
      <!-- 资料信息 -->
      <van-grid
        :border="false"
        class="data-info"
      >
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录状态 -->
    <div v-else class="not-login">
      <div @click="$router.push('./login')">
        <img  class="mobile" src="./头像.png">
      </div>
      <div class="text">登录 / 注册</div>
    </div>
    <!-- 关注收藏按钮 -->
    <van-grid :column-num="2" class="nav-grid mb-4">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix = "toutiao"
        icon = "shoucang"
        text = "收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix = "toutiao"
        icon = "lishi"
        text = "历史"
      />
    </van-grid>
    <!-- 小智 -->
    <van-cell title="消息通知" is-link to="/" />
    <van-cell class="mb-4" title="小智同学" is-link to="/" />
    <van-cell
      class="logout-cell"
      title="退出登录"
      v-if="user"
      @click="onLogout"
    />
  </div>
</template>

<script>
// 引入vant组件
import { Cell, CellGroup, Button, Image, Grid, GridItem, Dialog } from 'vant'

// 引入vuex状态管理内容
import { mapState } from 'vuex'

// 引入请求数据
import { getCurrentUser } from '@/api/user'
export default {
  name: 'MyIndex',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Image.name]: Image,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Dialog.Component.name]: Dialog.Component
  },
  data () {
    return {
      currentUser: {} // 当前登录用户信息
    }
  },
  created () {
    this.loadCurrentUser()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 用户退出登录
    onLogout () {
      // 提示用户确认退出
      // 点击退出 变成未登录状态
      // 点击取消不做任何操作
      Dialog.confirm({
        title: '退出提示',
        message: '确认退出吗'
      })
        .then(() => { // 确认执行这里
          this.$store.commit('setUser', null) // 清除用户状态
        })
        .catch(() => { // 退出执行这里
          // on cancel
        })
    },
    // 用户登录之后加载数据
    // 在这里可以使用 13922222222 246810进行获取信息
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    }
  }
}
</script>

<style scoped lang="less">
.my-container{
  .my-info {
    background: url('./banner.png') no-repeat;
    background-size: cover;
    .base-info{
      height: 115px;
      box-sizing: border-box;
      padding-top: 38px;
      padding-bottom: 11px;
      background-color: unset;
      .avatar {
        width: 66px;
        height: 66px;
        box-sizing: border-box;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name{
        color: white;
        font-size: 15px;
      }
      .update-btn{
        height: 16px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info{
      .data-info-item{
        height: 65px;
        color: #fff;
        .text-wrap{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count{
            font-size: 18px;
          }
          .text{
            font-size: 11px;
          }
        }

      }
    }
    /deep/ .van-grid-item__content{
      background-color: unset;
    }
  }
  /deep/ .nav-grid{
    .nav-grid-item{
      height: 70px;
      .toutiao{
        font-size: 22px;

      }
      .toutiao-shoucang{
        color: #eb5253;
      }
      .toutiao-lishi{
        color: #ff9d1d;
      }
      .van-grid-item__text{
        font-size: 14px;
        color: #333;
      }
    }
  }
  .logout-cell{
    text-align: center;
    color: #d86262;
  }
  .mb-4{
    margin-bottom: 4px;
  }
  .not-login{
    height: 180px;
    background: url('./banner.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .mobile{
      width: 66px;
      height: 66px;
    }
    .text{
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>

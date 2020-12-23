<template>
  <div class="home-container">
    <!-- 顶部搜索框 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        icon="search"
        type="info"
        round
        class="search-btn"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 文章频道列表 -->
    <!--
      标签页组件有一个功能，只有你第一次查看标签页的时候才会渲染页面里面的内容
     -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        class="tab-item"
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <!-- prop传值 如果没有v-bind则里面的任何值都是字符串 如果需要动态绑定数据，则使用v-bind -->
        <article-list :channel="channel"/>
      </van-tab>
      <!-- 在这里由于右边的汉堡按钮会遮挡列表最后一个元素的显示，我们在这里使用div来进行占位 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div
        slot="nav-right"
        @click="isChannelEditShow = true"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- 弹窗层 -->
    <!--
      closeable:显示关闭按钮
      close-icon-position：关闭按钮位置
      get-container：当前渲染的弹窗挂载的dom节点
     -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    >
      <!-- 在模板中使用$event代表事件传递的参数 -->
      <channel-edit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @update-active="active = $event"
      ></channel-edit>
    </van-popup >
  </div>
</template>

<script>
// 引入vant组件
import { NavBar, Button, Tab, Tabs, Popup, Icon } from 'vant'

// 引入获取数据接口
import { getUserChannels } from '@/api/user'

// 引入文章列表组件
import ArticleList from './commponents/article-list'
// 引入频道编辑组件
import ChannelEdit from './commponents/channel-edit'

// 引入vuex状态管理
import { mapState } from 'vuex'

// 引入获取本地存储
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    ArticleList,
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    ChannelEdit
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false // 控制编辑频道的显示状态
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        // 已登录，请求获取线上的用户频道列表
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录，获取本地存储数据
        const loadChannels = getItem('user-channels')
        if (loadChannels) {
          channels = loadChannels // 如果有本地存储的记录则使用
        } else {
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到data中供{{}}使用
      this.channels = channels
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  .search-btn{
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
  }
  /deep/ .van-nav-bar__title{
    max-width: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text{
      font-size: 14px;
    }
  }
  .channel-tabs{
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line{
      width: 15px !important;
      height: 3px;
      background: #3296fa;
      bottom: 20px;
    }
  }
  /* 在使用flex布局时，某个元素不想参与平分容器，想固定占有一部分的位置，则使用flex-shrink*/
  .wap-nav-placeholder{
    width: 33px;
    flex-shrink: 0;
  }
  .wap-nav-wrap{
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    opacity: .9;
    .van-icon{
      font-size: 24px;
    }
    &:before {
      content: '';
      width: 1px;
      height: 43px;
      background: url('./line.png') no-repeat;
      background-size: cover;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>

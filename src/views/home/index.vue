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
      >搜索</van-button>
    </van-nav-bar>
    <!-- 文章频道列表 -->
    <van-tabs v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >{{channel.name}}</van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 引入vant组件
import { NavBar, Button, Tab, Tabs } from 'vant'

// 引入获取数据接口
import { getUserChannels } from '@/api/user'

export default {
  name: 'HomeIndex',
  components: {
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [] // 频道列表
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      // 请求获取频道数据
      const { data } = await getUserChannels()
      this.channels = data.data.channels
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
}
</style>

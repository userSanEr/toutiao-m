<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 加载vant组件
import { List, Cell, PullRefresh } from 'vant'

// 获取请求数据
import { getArticles } from '@/api/article'

// 引入列表组件
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    [List.name]: List,
    [Cell.name]: Cell,
    [PullRefresh.name]: PullRefresh,
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制加载结束状态，加载结束，不会再触发加载更多
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的loading状态
      refreshSuccessText: '' // 下拉刷新成功的提示文本
    }
  },
  methods: {
    async onLoad () {
      // 1.异步更新数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳，timestamp相等于页码
        with_top: 1 // 是否包含置顶文章，1是包含，0是不包含
      })
      // 请求下一次数据，用本次返回的时间戳
      // 2.把数据放到list中
      const { results } = data.data
      this.articles.push(...results)
      // 3.设置本次加载是否结束
      // loading用来判断是否需要加载下一次，否则就会停在这里
      this.loading = false
      // 4. 数据全部加载完成
      // 数据全部加载结束了，不会再触发加载更多 finished 用来控制是否加载结束
      if (results.length) {
        // 更新获取下一页数据
        this.timestamp = data.data.pre_timestamp // 请求下一页数据的时间戳
      } else {
        // 没有数据，将finish设置为true
        this.finished = true
      }
    },
    async onRefresh () {
      // 下拉刷新，组件自己就会展示loading状态
      // 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(), // 只要时不同的时间戳返回的就是不同的数据
        with_top: 1
      })
      // 把数据放到数据列表中(往顶部追加)
      const { results } = data.data
      this.articles.unshift(...results)
      // 关闭刷新的状态(loading)
      this.isRefreshLoading = false
      // 设置刷新成功文案
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style lang="less" scoped>
.article-list{
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 46px;
  overflow-y: auto;
}
</style>

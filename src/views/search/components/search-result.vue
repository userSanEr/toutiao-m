<template>
  <div class="search-result">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
        <van-cell
            v-for="(article, index) in list"
            :key="index"
            :title="article.title"
        />
    </van-list>
  </div>
</template>

<script>
// 引入vant组件
import { List, Cell } from 'vant'

// 引入请求数据方法
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {
    [List.name]: List,
    [Cell.name]: Cell
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页码
      perPage: 10 // 每页大小

    }
  },
  methods: {
    /**
         * 1.请求获取数据
         * 2.将数据放到数据列表中
         * 3.关闭本次loading
         * 4.判断是否还有数据
         * 如果有：则更新获取下一页数据
         * 如果没有：则把finish设置为true，关闭加载更多
         */
    onLoad: async function () {
      const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.searchText // 搜索的关键字
      })
      const { results } = data.data
      this.list.push(...results)
      this.loading = false
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-result{
    position: fixed;
    left: 0;
    right: 0;
    top: 54px;
    bottom: 0;
    overflow-y: auto;
}
</style>

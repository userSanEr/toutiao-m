<template>
  <div class="search-container">
    <!-- 搜索框
    在 van-search 外层增加form标签，且action不为空，即可在输入法中显示搜索按钮。
    -->
    <form action="/">
        <van-search
            v-model="searchText"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch(searchText)"
            @focus="isResultShow=false"
            @cancel="$router.back()"
        />
    </form>
    <!-- 搜索结果
        如果有搜索结果则展示搜索结果组件
        当前没有搜索结果则判断是否有搜索的数据
        如果有搜索的数据则展示联想的内容
        如果也没有搜索的数据，则展示历史记录
     -->
    <search-result
        v-if="isResultShow"
        :search-text="searchText"
    />
    <!-- 联想组件 -->
    <search-suggestion
        v-else-if="searchText"
        :search-text="searchText"
        @search="onSearch"
    />
    <!-- 历史记录 -->
    <search-history
        v-else
        :search-histories="searchHistories"
        @search ="onSearch"
        @update-histories="searchHistories = $event"
    />

  </div>
</template>

<script>
// 引入vant组件内容
import { Search, Form } from 'vant'

// 引入页面组件
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'

// 引入存取方法
import { setItem, getItem } from '@/utils/storage'

// 引入请求历史数据接口
// import { getUserSearchHistories } from '@/api/search'

// 引入数据管理仓库
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  components: {
    [Search.name]: Search,
    [Form.name]: Form,
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  created () {
    this.loadSearchHistories()
  },
  data () {
    return {
      searchText: '', // 搜索输入框的内容
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: [] // 存放历史记录信息 如果可以获取数据则使用获取到的数据否则传[]
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    // 监听searchHistories数据的变化，当发生改变时，改变本地存储
    searchHistories () {
      console.log(this.searchHistories)
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    onSearch (searchText) {
      // 让输入框设置为你要搜索的结果
      this.searchText = searchText
      // 先判断是否与当前数组中已经存在的内容有重复项
      const index = this.searchHistories.indexOf(searchText)
      // 如果存在该项先删除
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 将最新的搜索内容保存在数组头部
      this.searchHistories.unshift(searchText)
      /**
             * 如果用户已登录，则把搜索结果存储到线上
             * 提示：只要我们调用获取搜索结果的后端接口，会自动存储搜索记录
             * 如果没有登录，则把信息存储到本地
             * 发生变化则存储
             */
      // 在触发回车的时候才会展示搜索结果
      this.isResultShow = true
    },
    loadSearchHistories: function () {
      /**
             * 因为后端帮我们存储的用户搜索记录太少了(只有4条)
             * 所以我们这里让后端返回的历史记录和本地历史记录合并到一起
             */
      const searchHistories = getItem('search-histories') || [] // 获取本地存储的数据
      // if(this.user){
      //     const { data } = await getUserSearchHistories()  //获取线上的数据
      //     console.log(data)
      //     /**
      //      * [...,...] 将数组合并
      //      * new Set [...,...]  对数组去重
      //      * ...new Set 将集合转为数组
      //      */
      //     searchHistories = [...new Set([  //将本地存储和线上存储的数据合并
      //         ...searchHistories ,
      //         ...data.data.keywords
      //     ])]
      // }
      this.searchHistories = searchHistories
    },
    onCancel () {
      console.log('onCancel')
    }
  }
}
</script>

<style>

</style>

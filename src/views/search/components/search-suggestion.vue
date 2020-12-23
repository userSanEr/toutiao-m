<template>
  <div class="search-suggestion">
    <!--
      在van-cell中直接使用:title绑定的字符串无法渲染字符串中的html的标签
      so 我们需要使用插槽的方式 <div slot="title" v-html="">
     -->
      <van-cell
        icon="search"
        v-for="(str, index) in suggestions"
        :key="index"
        @click="$emit('search', str)"
      >
        <div slot="title" v-html="highlight(str)"></div>
      </van-cell>
  </div>
</template>

<script>
// 引入vant组件
import { Cell, CellGroup } from 'vant'

// 引入联想建议请求接口
import { getSearchSuggestions } from '@/api/search'

// 引入第三方包
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  data () {
    return {
      suggestions: []
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  /**
     * watch可以监视data和prop中的数据
     * 函数名是当前监视的内容
     */
  watch: {
    /**
       * 简写：
       * searchText(){
       *  console.log()
       * }
       */
    // 监视器的写法
    searchText: {
      handler: debounce(async function () {
        // 请求获取数据、展示
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      immediate: true // 该回调将会在侦听开始之后立即调用
    }
  },
  methods: {
    /**
       * 在直接使用正则表达式字面量创建时，中间的内容都会直接当作字符串来处理
       * eg: /str/gi 则会直接匹配str，并不会处理变量
       * so: 我们需要使用new表达式来创建正则表达式：
       * eg: new RegExp()
       * 第一个参数：要进行拼配的字符串、变量
       * 第二个参数：匹配范围、以及大小写
       * 在这里并没有改变原始数据，只是在显示数据的时候调用了一下这个方法
       */
    highlight: function (str) {
      return str.replace(
        new RegExp(this.searchText, 'gi')
        , `<span style="color:red">${this.searchText}</span>`)
    }
  }
}
</script>

<style>

</style>

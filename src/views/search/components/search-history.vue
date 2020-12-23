<template>
  <div class="search-history">
      <van-cell
        title="搜索历史"
      >
        <div v-if="isDeleteShow">
          <!--
            props数据如果是引用类型（数组、对象）可以修改
            注意这个修改指的是：user.name = 'Jack' || arr.push(123) || arr.splice(index, 1)
            但是不能给这个props直接重新赋值 ：xxx = xxx
           -->
            <span @click="$emit('update-histories', [])">全部删除</span>
            &nbsp;&nbsp;
            <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon
          name="delete"
          @click="isDeleteShow = true"
          v-else
        ></van-icon>
      </van-cell>
      <van-cell
        :title="history"
        v-for="(history, index) in searchHistories"
        :key="index"
         @click="onDelete(history, index)"
      >
        <van-icon
          v-show="isDeleteShow"
          name="close"
        ></van-icon>
      </van-cell>
  </div>
</template>

<script>
// 引入vant组件
import { Cell, CellGroup, Icon } from 'vant'

// 引入存储数据的方法
// import { setItem } from '@/utils/storage'

export default {
  name: 'SearchHistory',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Icon.name]: Icon
  },
  props: {
    'search-histories': {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 删除的显示状态
    }
  },
  methods: {
    // 删除对应的列表项
    onDelete: function (history, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        /**
           * 持久化处理
           * 1、修改本地存储的数据
           * 2、请求接口删除线上的数据
           * 无论是否登录都把数据持久化到本地
           * 如果已登录，则删除线上的历史数据
           * 注：没有删除单个历史数据的接口
           * 只有删除所有历史记录的接口
           */
        return
      }
      // 非删除状态展示搜索结果
      this.$emit('search', history)
    }
  }
}
</script>

<style>

</style>

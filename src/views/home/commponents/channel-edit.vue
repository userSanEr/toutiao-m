<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell center :border="false">
        <div
            slot="title"
            class="channel-title"
        >我的频道</div>
        <van-button
            type="danger"
            plain
            round
            size="mini"
            @click="isEdit = !isEdit"
        >{{isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
        <van-grid-item
            class="grid-item"
            :class="{active: active === index}"
            v-for="(channel, index) in userChannels"
            :key="index"
            :text="channel.name"
            :icon="(isEdit && index !== 0) ? 'clear' : ''"
            @click="onUserChannelClick(channel, index)"
        />
    </van-grid>
    <!-- 编辑频道 -->
    <van-cell center :border="false">
        <div
            slot="title"
            class="channel-title"
        >频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
        <van-grid-item
            class="grid-item"
            v-for="(channel, index) in recommendChannels"
            :key="index"
            :text="'+'+channel.name"
            @click="onAdd(channel)"
        />
    </van-grid>
  </div>
</template>

<script>
// 引入vant组件
import { Cell, CellGroup, Button, Grid, GridItem } from 'vant'

// 引入请求数据
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'

// 引入存储数据
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  props: {
    userChannels: {
      type: Array,
      requried: true
    },
    active: {
      type: Number,
      requried: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有的频道数据列表
      isEdit: false, // 控制是否显示关闭按钮
      user: this.$store.state.user // 获取vuex中保存的user
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 请求所有频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    /**
         * 点击推荐列表的频道添加到上面的我的频道
         * 在这个方法里当我们对数据进行操作时，
         * 因为在上面使用计算属性，进行遍历该数组与所有的频道列表进行对比
         * 所以当其中数据发生变化时，也会影响相对的随着变动的数组
         */
    async onAdd (channel) {
      this.userChannels.push(channel)
      if (this.user) {
        // 登录状态，数据存储到线上
        await addUserChannel([{
          id: channel.id, // 频道 id
          seq: this.userChannels.length // 频道的 序号
        }])
      } else {
        // 没有登录，数据存储在本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 点击我的频道列表上面的x
    onUserChannelClick: function (channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    // 删除我的频道里面对应的当前频道
    async deleteChannel (channel, index) {
      if (index <= this.active) {
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)

      if (this.user) {
        await deleteUserChannel(channel.id)
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    // 关闭编辑频道弹窗并且将当前页面呈现改变成当前选择的频道
    switchChannel: function (index) {
      // 切换频道
      this.$emit('update-active', index)
      // 关闭弹窗层
      this.$emit('close')
    }
  },
  computed: {
    recommendChannels () {
      // 思路：所有的 - 我的 = 剩下的推荐
      /**
             * filter方法 过滤数据，根据方法返回布尔值true来收集数据
             * filter查找满足条件的所有元素
             * find查找满足条件的单个元素
             */
      return this.allChannels.filter(channel => {
        // 判断channel是否属于用户频道
        return !this.userChannels.find(userChannels => {
          // 找到满足该条件的元素并返回
          return userChannels.id === channel.id
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit{
    padding-top: 54px;
    .channel-title{
        font-size: 16px;
        color: #333;
    }
    .grid-item{
        width: 80px;
        height: 43px;
        /deep/ .van-grid-item__content{
            background: #f4f5f6;
            .van-grid-item__text{
                font-size: 14px;
                color: #222;
                margin-top: 0;
            }
        }
        /deep/ .van-grid-item__icon{
            position: absolute;
            right: -5px;
            top: -5px;
            font-size: 20px;
            color: #ccc;
        }

    }
    .active{
        /deep/ .van-grid-item__text{
            color: red !important;
        }
    }
}
</style>

<template>
  <div class="article-container">
      <!-- 导航栏 -->
      <van-nav-bar
        class="app-nav-bar"
        title="文章详情"
        left-arrow
        @click-left="$router.back()"
      />
      <h1 class="title">牛逼的程序员都用的开源工具，你用了几个</h1>
      <van-cell center class="user-info">
          <div slot="title" class="name">天涯小型客</div>
          <van-image
            fit="cover"
            class="avatar"
            round
            slot="icon"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div slot="label" class="pubdate">14小时前</div>
          <van-button
            class="follow-btn"
            type="info"
            round
            size="small"
            icon="plus"
          >关注</van-button>
      </van-cell>
        <div class="markdown-body">

        </div>
  </div>
</template>

<script>
// 引入github-markdown.css
import './github-markdown.css'

// 引入vant组件
import { NavBar, Cell, Image as VanImage, Button } from 'vant'

// 引入请求数据的接口
import { getArticleById } from '@/api/article'

/**
 * 在组件中获取动态路由参数：
 * 方式一：this.$route.params.articleId
 * 方式二：props传参
 */
export default {
  name: 'ArticleIndex',
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  components: {
    [Cell.name]: Cell,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [VanImage.name]: VanImage
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>
.title{
    font-size: 20px;
    color: #3a3a3a;
    padding: 14px;
    background: #fff;
    margin: 0;
}
.user-info{
    .avatar{
        width: 35px;
        height: 35px;
        margin-right: 8px;
    }
    .name {
        font-size: 12px;
        color: #333;
    }
    .pubdate {
        font-size: 11px;
        color: #b4b4b4;
    }
    .follow-btn{
        width: 85px;
        height: 29px;
    }
}
.markdown-body{
    padding: 14px;
    background: #fff;
}
</style>

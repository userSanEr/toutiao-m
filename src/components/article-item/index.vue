<template>
    <van-cell
        class="article-item"
        :to="{
            name: 'article',
            params: {
                articleId: article.art_id
            }
        }"
    >
        <!-- 自定义左侧title -->
        <div slot="title" class="title van-multi-ellipsis--l3">{{ article.title }}</div>
        <!-- 自定义标题下方label内容 -->
        <div slot="label">
            <div
                v-if="article.cover.type === 3"
                class="cover-wrap"
            >
                <div
                    v-for="(img, index) in article.cover.images"
                    :key="index"
                    class="cover-wrap-item"
                >
                    <van-image
                        :src="img"
                        fit="cover"
                        class="cover-item"
                    />
                </div>
            </div>
            <div class="label-wrap">
                <span>{{ article.aut_name }}</span>
                <span>{{ article.collect_count}}</span>
                <span>{{ article.pubdate | relativeTime }}</span>
            </div>
        </div>
        <van-image
            class="right-cover"
            :src="article.cover.images[0]"
            fit="cover"
            v-if="article.cover.type === 1"
        />
    </van-cell>
</template>

<script>
// 引入vant组件
import { Cell, Image as VanImage } from 'vant'

export default {
  name: 'ArticleItem',
  components: {
    [Cell.name]: Cell,
    [VanImage.name]: VanImage
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.article-item{
    .title{
        font-size: 16px;
        color: #3a3a3a;
    }
    /deep/ .van-cell__value{
        flex:unset;
        width: 116px;
        height: 73px;
        margin-left: 12px;
    }
    .right-cover{
        width: 116px;
        height: 73px;
    }
    .cover-wrap{
        padding: 15px 0;
        display: flex;
        .cover-wrap-item{
            flex: 1;
            height: 73px;
            &:not(:last-child) {
                padding-right: 4px;
            }
            .cover-item{
                width: 100%;
                height: 73px;
            }
        }
    }
    .label-wrap{
        font-size: 11px;
        color: #b4b4b4;
        span{
            margin-right: 12px;
        }
    }
}
</style>

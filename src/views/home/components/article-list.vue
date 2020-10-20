<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
<!--        <van-cell v-for="(article,index) in articles" :key="index" :title="article.title"/>-->
        <article-item v-for="(article,index) in articles" :article="article" :key="index"></article-item>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
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
      timestamp: null, // 获取下一页数据的时间戳
      articles: [], // 数据列表
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制加载结束的状态，当加载结束，不在触发加载更多
      isRefreshLoading: false // 下拉刷新的loading状态
    }
  },
  methods: {
    // 下拉刷新事件
    async onRefresh () {
      // 下拉刷新,组件自己会展示loading状态
      // 1请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: Date.now(), // 为了方便学习，只需要传递不同的时间戳就一定给你返回不一样的数据，而且数据不为空
        with_top: 1
      })
      const { results } = data.data
      // 2.把数据放到数据列表中（顶部加）
      this.articles.unshift(...results)
      // 3.关闭刷新的状态loading
      this.isRefreshLoading = false
      // 4.下拉刷新的成功提示
      this.$toast({
        message: `更新了${results.length}条数据`,
        duration: 1500
      })
    },
    // 上拉加载更多
    async onLoad () {
      // 异步更新数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })
      // console.log(data)
      const { results } = data.data
      this.articles.push(...data.data.results)
      // 加载状态结束
      this.loading = false

      // 如果还有数据
      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，设置加载状态为结束
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .article-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 90px;
    bottom: 50px;
    overflow-y: auto;
  }
</style>

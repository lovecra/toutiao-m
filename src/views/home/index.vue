<template>
  <div class="home-container">
    <!--  导航栏  -->
    <van-nav-bar
      class="app-nav-bar"
    >
      <van-button
      slot="title"
      icon="search"
      type="info"
      round
      class="search-btn"
      size="small"
      >搜索</van-button>
    </van-nav-bar>
    <!--  tab栏切换  -->
    <van-tabs v-model="active">
      <van-tab
        :title="item.name"
        v-for="item in channels"
        :key="item.id">
        <!--   文章列表组件     -->
        <article-list
        :channel="item"></article-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  created () {
    this.loadChannels()
  },
  methods: {
    // 获取频道数据
    async loadChannels () {
      const { data } = await getUserChannels()
      // console.log(data)
      this.channels = data.data.channels
    }
  },
  data () {
    return {
      active: 0,
      channels: [] // 频道列表数据
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    /deep/ .van-nav-bar__title {
      max-width: unset;
    }

    .search-btn {
      width: 277px;
      height: 32px;
      background-color: #5babfb;
      border: none;
      .van-button__text {
        font-size: 14px;
      }
      .van-icon {
        font-size: 16px;
      }
    }
  }
</style>

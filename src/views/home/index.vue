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
      >搜索
      </van-button>
    </van-nav-bar>
    <!--  tab栏切换  -->
    <van-tabs class="channel-tabs" v-model="active" swipeable>
      <!--  汉堡按钮 点击进行弹出层的切换   -->
      <div class="wap-nav-wrap" slot="nav-right" @click="isChannelEditShow = true">
        <van-icon name="wap-nav"></van-icon>
      </div>
      <!--  具名插槽可以写多个都会插入到那个位置，为了解决汉堡按钮遮住tabs最后一个栏位  -->
      <div slot="nav-right" class="wap-nav-placeholder">
      </div>
      <van-tab
        :title="item.name"
        v-for="item in channels"
        :key="item.id">
        <!--   文章列表组件     -->
            <article-list
              :channel="item"></article-list>
      </van-tab>
    </van-tabs>

    <!-- 频道编辑弹出层   -->
    <van-popup
      v-model="isChannelEditShow"
      get-container="body"
      position="bottom"
      round
      :overlay="false"
      class="channel-edit-popup"
      style="height: 100%"
    >
      <channel-edit :user-channels="channels" :active="active" @onClickPopup="onClickPopup" @update-active="onUpdateActive"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  created () {
    this.loadChannels()
  },
  methods: {
    onUpdateActive (index) {
      this.active = index
      // console.log($event)
    },
    onClickPopup () {
      this.isChannelEditShow = false
    },
    // 获取频道数据
    async loadChannels () {
      let channels = []
      if (this.user) {
        // 已经登录
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 没有登录,判断是否有本地存贮的频道列表
        const localChannels = getItem('user-channels')
        if (localChannels) {
          channels = localChannels
        } else {
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
      // console.log(data)
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表数据
      isChannelEditShow: true // 控制编辑频道的显示状态
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

    .channel-tabs {
      /deep/ .van-tab {
        border-right: 1px solid #edeff3;
        border-bottom: 1px solid #edeff3;
      }

      /deep/ .van-tabs__line {
        height: 3px;
        width: 15px;
        background-color: #3296fa;
        margin-bottom: 5px;
      }
    }
    .wap-nav-wrap {
      position: fixed;
      /*top: 0;*/
      right: 0;
      height: 43px;
      width: 33px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      border-left: 1px solid #edeff3;
      opacity: .9;
      .van-icon {
        font-size: 24px;
      }
      /*&:before {*/
      /*  content: '';*/
      /*  position: absolute;*/
      /*  left: 0;*/
      /*  top: 0;*/
      /*  !*bottom: 0;*!*/
      /*  height: 43px;*/
      /*  width: 1px;*/
      /*  background: url("./line.png") no-repeat;*/
      /*  background-size: contain;*/
      /*}*/
    }

    /*  占位符*/
    .wap-nav-placeholder {
      flex-shrink: 0;
      width: 33px;
      border-bottom: 1px solid #edeff3;
    }
  }
</style>

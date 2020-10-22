<template>
  <div class="channel-edit">

    <van-nav-bar
      title="编辑频道"
      @click-left="onClickLeft"
    >
      <div slot="left" class="close-btn">
        <van-icon class-prefix="toutiao" name="guanbi"></van-icon>
      </div>
    </van-nav-bar>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">
        <span>我的频道</span>
        <span class="small-title">点击进入频道</span>
      </div>
      <van-button
        class="btn-edit"
        type="danger"
        round
        plain
        size="mini"
        @click="isEdit =! isEdit"
      >{{isEdit ? '完成' : '编辑'}}
      </van-button>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        v-for="(item, index) in userChannels"
        :key="index"
        :text="item.name"
        :icon="( isEdit && index !==0 ) ? 'clear' : ''"
        @click="onUserChannelClick(index, item)"
      />
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">
        <span>频道推荐</span>
        <span class="small-title">点击添加频道</span>
      </div>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="item in recommendChannels"
        :key="item.id"
        :text="item.name"
        @click="onAdd(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    // 首页tab栏切换的状态值
    active: Number,
    userChannels: {
      type: Array,
      required: true
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    ...mapState(['user']),
    // 所有频道的数据减去我的频道数据等于推荐频道数据
    recommendChannels () {
      return this.allChannels.filter(allchannel => {
        return !this.userChannels.find(userchannel => {
          return userchannel.id === allchannel.id
        })
      })
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道数据列表
      isEdit: false // 控制编辑的显示状态
    }
  },
  methods: {
    onUserChannelClick (index, item) {
      if (this.isEdit && index !== 0) {
        // 编辑状态,删除频道
        this.deleteChannel(index, item)
      } else {
        // 非编辑状态,切换频道
        this.switchChannel(index)
      }
    },
    async deleteChannel (index, item) {
      if (index <= this.active) {
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        await deleteUserChannel(item.id)
      } else {
        // 没有登录,数据存贮到本地
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel (index) {
      // 切换频道
      this.$emit('update-active', index)
      // 数据持久化
      this.$emit('onClickPopup')
    },
    onClickLeft () {
      this.$emit('onClickPopup')
    },
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd (channel) {
      this.userChannels.push(channel)

      // 数据持久化
      if (this.user) {
        // 登录了，数据存贮在服务器上
        await addUserChannel({
          channels: [
            { id: channel.id, seq: this.userChannels.length }
          ]
        })
      } else {
        // 没有登录,数据存贮到本地
        setItem('user-channels', this.userChannels)
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .channel-edit {
    .close-btn {
      color: #1989fa;

      /deep/ .toutiao {
        font-size: 14px;
      }
    }

    .channel-title {
      font-size: 16px;
      color: #333;

      .small-title {
        font-size: 12px;
        margin-left: 10px;
        color: #b4b4b4;
      }
    }

    .btn-edit {
      width: 50px;
      font-size: 12px;
    }

    .grid-item {
      height: 43px;

      /deep/ .van-grid-item__content {
        background-color: #f4f5f6;

        .van-grid-item__text {
          font-size: 14px;
          color: #222;
          /* 控制编辑的叉号按钮出现时文字会产生一个margin-top 清除掉 */
          margin-top: 0;
        }

        /deep/ .van-grid-item__icon {
          position: absolute;
          right: -5px;
          right: -5px;
          top: -5px;
          font-size: 20px;
          color: #ccc;
        }
      }
    }

    /*  推荐的字体颜色为红色 */

    /*.grid-item-red {*/
    /*  &:first-child {*/
    /*    /deep/ .van-grid-item__content {*/
    /*      position: relative;*/

    /*      .van-grid-item__text {*/
    /*        color: #ee0a24;*/
    /*      }*/
    /*    }*/
    /*  }*/
    /*}*/

    .active {
      /deep/ .van-grid-item__text {
        color: #ee0a24 !important;
      }
    }
  }
</style>

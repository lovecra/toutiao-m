<template>
  <div class="my-container">
    <!--  已经登录  -->
    <van-cell-group v-if="user" class="my-info">
      <!--  cell单元格    -->
      <van-cell
        center
        :border="false"
        class="base-info"
      >
        <van-image class="avatar" slot="icon" fit="cover" round :src="currentUser.photo" />
        <div slot="title" class="name">{{currentUser.name}}</div>
        <van-button size="small" round class="update-btn">编辑资料</van-button>
      </van-cell>
    <!--  宫格    -->
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!--  未登录  -->
    <div v-else class="not-login">
      <img @click="$router.push('/login')" src="./手机.png" class="phone-img">
      <div class="text">登录 / 注册</div>
    </div>

    <!--  收藏和历史  -->
    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="shoucang" text="收藏" />
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="lishi" text="历史" />
    </van-grid>

    <!--  我的页面导航  -->
    <van-cell title="消息通知" is-link to="/" />
    <van-cell class="mb-4" title="小智同学" is-link to="/" />
    <!--  退出登录按钮  -->
    <van-cell @click="onLogout" v-if="user" title="退出登录" class="login-cell" />

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'MyIndex',
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      currentUser: ''
    }
  },
  created () {
    this.loadUserInfio()
  },
  methods: {
    // 加载用户基本信息api
    async loadUserInfio () {
      const { data } = await getUserInfo()
      console.log(data)
      this.currentUser = data.data
    },
    // 退出登录功能
    onLogout () {
      // 提示用户确认退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗?'
      })
        .then(() => {
          // on confirm
          // 清楚用户状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel

        })

      // 确认退出
    }
  }
}
</script>

<style lang="less" scoped>
  .my-container {
    .my-info {
      background: url("./banner.png") no-repeat;
      background-size: cover;
      .base-info {
        height: 115px;
        box-sizing: border-box;
        padding-top: 38px;
        padding-bottom: 11px;
        background-color: unset;
        .avatar {
          box-sizing: border-box;
          width: 66px;
          height: 66px;
          border: 1px solid #fff;
          margin-right: 11px;

        }
        .name {
          font-size: 15px;
          color: #fff;
        }
        .update-btn {
          height: 16px;
          font-size: 10px;
          color: #666;
        }
      }

      .data-info {
        .data-info-item {
          height: 65px;
          color: #fff;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
            text-align: center;
          }
        }
      }

      /deep/ .van-grid-item__content {
        background-color: unset;
      }
    }

    /deep/ .nav-grid {
      .nav-grid-item {
        height: 70px;
        .toutiao {
          font-size: 22px;
        }
        .toutiao-shoucang {
          color: #eb5253;
        }
        .toutiao-lishi {
          color: #ff9d1d;
        }
        .van-grid-item__text {
          color: #333;
          font-size: 14px;
        }
      }
    }

    .login-cell {
      text-align: center;
      color: #d86262;
    }

    .mb-4 {
      margin-bottom: 5px;
    }
  /* 未登录 */
    .not-login {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 180px;
      background: url("./banner.png") no-repeat;
      background-size: cover;
      .phone-img {
        width: 66px;
        height: 66px;
      }
      .text {
        color: #fff;
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }
</style>

<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 登录表单   -->
    <van-form @submit="onLogin"
              :show-error="false"
              :show-error-message="false"
              @failed="onFailed"
              validate-first
              ref="login-form"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        center
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        clearable
        placeholder="请输入验证码"
        name="code"
        center
        :rules="formRules.code"
      >
        <template #button>
          <!--    CountDown 倒计时      -->
          <van-count-down
            v-if="isCountDownShow"
            :time=" 1000 * 60 "
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button :loading="isSendSmsLoading" v-else size="small" class="send-btn" round @click.prevent="onSendCms">获取验证码</van-button>
        </template>
      </van-field>
      <!--   登录按钮   -->
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCms } from '@/api/user'
// import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  data () {
    return {
      isSendSmsLoading: false, // 发送验证码的按钮的状态
      isCountDownShow: false, // 控制倒计时和发送按钮的显示状态
      user: {
        mobile: '17090086870',
        code: '246810'
      },
      formRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号'
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '手机号码格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      }
    }
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    async onLogin () {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁止背景点击
        duration: 0
      })
      try {
        const { data } = await login(this.user)
        // console.log(res)`

        this.$toast.success('登录成功')
        // 将后端返回的用户登录状态放到vuex容器中
        this.$store.commit('setUser', data.data)

        // 登录成功,跳转回原来页面
        this.$router.back() // 先用这种方式，但是不太好，有缺点
      } catch (err) {
        // console.log(err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    onFailed (error) {
      console.log(error)
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendCms () {
      try {
        await this.$refs['login-form'].validate('mobile')
        // 验证通过是没有返回结果的
        // 发送验证码

        this.isSendSmsLoading = true // 展示按钮的loading状态,防止网络慢用户多次点击,触发网络点击

        await sendCms(this.user.mobile)
        // console.log(res)
        /**
           * data: {
              message: "OK"
              data: {mobile: "13477672013"}
           }
           */
        // 短信发出去了,隐藏发送按钮，显示倒计时
        this.isCountDownShow = true
        // 倒计时结束,隐藏倒计时 ，显示发送按钮
        // 通过监视倒计时的finish的事件完成的
      } catch (err) {
        // console.log(err)
        /**
           * {name: "mobile", message: "请输入手机号"}
           */
        let message = ''
        if (err && err.response && err.response.status === 429) {
          message = '发送太频繁，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message,
          position: 'top'
        })
      }
      // 无论验证码发送成功与否，都要关闭发送按钮的loading状态
      this.isSendSmsLoading = false
    }

  }
}
</script>

<style lang="less" scoped>
  .login-container {
    .send-btn {
      width: 76px;
      height: 23px;
      font-size: 11px;
      color: #666;
      background-color: #ededed;
    }

    .login-btn-wrap {
      padding: 26px 16px;

      .login-btn {
        background-color: #6db4fb;
        border: none;

        .van-button__text {
          font-size: 15px;
        }
      }
    }
  }

</style>

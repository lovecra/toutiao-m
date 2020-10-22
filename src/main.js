import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载vant组件样式库
import 'vant/lib/index.css'

// 加载全局样式(覆盖第三方样式)
import './styles/index.less'

// 加载vant组件库
import Vant from 'vant'

// 自动设置REM基准值（html标签字体大小）
import 'amfe-flexible'

// 加载dayjs全局过滤器的使用
import './utils/dayjs'

// import './api/test'

// 全局注册 vant中的组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

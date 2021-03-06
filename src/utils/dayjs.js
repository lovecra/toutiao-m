/*
初始化dayjs相关的配置
 */

import Vue from 'vue'
import dayjs from 'dayjs'

// 配置使用中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')
// 把处理相对时间的代码包装为全局过滤器,然后就可以在任何组件的模板中使用了
// 所谓过滤器就是在模板中调用的函数

Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})

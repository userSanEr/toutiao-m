/**
 * 初始化dayjs的相关配置
 */

// 引入vue 添加全局过滤器
import Vue from 'vue'

// 引入dayjs
import dayjs from 'dayjs'

// 加载使用中文语言包
import 'dayjs/locale/zh-cn'

// 引入相对时间处理包
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

/**
 * 把处理相对时间的代码包装为全局过滤器
 * 然后就可以在任何组件模板中使用了
 * 所谓的过滤器其实就是一个可以在模板中调用自己的函数而已
 * 在组件的模板中使用过滤器：{{xxx | relativeTime}}
 * 管道符前面的内容会作为参数传递给过滤器函数
 * 过滤器的返回值会渲染到使用过滤器的模板中
 */

// 使用过滤器处理时间 格式化 value代表进行过滤的内容 return出去的值是你修改后的内容
Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})

/**
 * dayjs() 获取当前时间
 * to 从之前到现在 为12年内
 * from 从现在到之前 为12年前
 * console.log(dayjs('2020-05-12').from(dayjs()))
 */

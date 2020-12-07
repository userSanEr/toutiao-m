<template>
  <div class="login-container">
    <!-- 头部标题 -->
    <van-nav-bar
        class="app-nav-bar"
        title="登录"
        left-arrow
        @click-left="$router.back()"
    />
    <!-- 输入框 -->
    <!-- 基于vant的表单验证：
        1、使用van-form组件包裹所有的表单项 van-filed
        2、给van-form绑定submit事件
        3、当表单提交的时候会触发submit事件
        提示：只要表单验证通过，才会调用submit
        4、在代码中想要将某个属性声明为true (1)可以直接将属性名写上 (2)使用:属性名="false"
     -->
    <van-form
        @submit="onLogin"
        :show-error = "false"
        :show-error-message = "false"
        @failed = "onFailed"
        ref="login-from"
        validate-first
    >
        <van-field
            v-model="user.mobile"
            name="mobile"
            center
            icon-prefix="toutiao"
            left-icon="shouji"
            placeholder="请输入手机号"
            :rules="formRules.mobile"
        />
        <van-field
            v-model="user.code"
            name="code"
            center
            clearable
            icon-prefix="toutiao"
            left-icon="yanzhengma"
            placeholder="请输入验证码"
            :rules="formRules.code"
        >
        <!--prevent 阻止默认行为 是点击该按钮时不会去验证所有表单  -->
            <template #button>
                <van-count-down
                    :time="1000 * 60"
                    format="ss s"
                    v-if="isCountDownShow"
                    @finish = "isCountDownShow = false"
                />
                <van-button
                    v-else
                    size="small"
                    class="send-btn"
                    round
                    @click.prevent="onSendSms"
                    :loading = "isSendSmsLoading"
                >发送验证码</van-button>
            </template>
        </van-field>
        <!-- 登录按钮 -->
        <div class="login-btn-wrap">
            <van-button
                class="login-btn"
                type="info"
                block
            >登录</van-button>
        </div>
    </van-form>
  </div>
</template>

<script>
// 引入vant组件
import { NavBar, Field, Button, Toast, Form, CountDown } from 'vant'

// 引入接口请求
import { login, SendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Button.name]: Button,
    [Form.name]: Form,
    [CountDown.name]: CountDown
  },
  data () {
    return {
      // 表单输入信息
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 表单校验
      formRules: {
        mobile: [
          { required: true, message: '请输入正确的手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入正确的验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 是否显示倒计时
      isSendSmsLoading: false // 发送验证码按钮的loading状态
    }
  },
  methods: {
    // 进行登录验证
    async onLogin () {
      Toast.loading({
        message: '登录中...', // 提示文案
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      // 4.处理响应结果
      try {
        const { data } = await login(this.user)
        Toast.success('登录成功') // 后面新的提示会覆盖之前的提示

        // 将后端返回的用户登录状态(token)等数据放到vuex容器中
        this.$store.commit('setUser', data.data)

        // 登陆成功跳转我的
        this.$router.back() // 回退
      } catch (err) {
        Toast.fail('登录失败，手机号或验证码输入错误')
      }
    },
    // 表单校验失败 错误信息提示
    onFailed: function (error) {
      if (error.errors[0]) {
        Toast(
          {
            message: error.errors[0].message, // 提示消息
            position: 'top' // 防止手机软键盘弹起挡住提示信息
          }
        )
      }
    },
    // 验证码点击事件
    async onSendSms () {
      /**
             * 校验手机号
             * 手机号有然后隐藏获取验证码  显示倒计时
             * 在短信60s过后，显示获取验证码，隐藏倒计时
             */
      try {
        // 验证手机号
        await this.$refs['login-from'].validate('mobile')
        // 验证时，为防止用户可点击，先将其设置为true
        this.isSendSmsLoading = true // 展示按钮的loading状态 防止网络慢 用户多次点击
        // 验证成功，发送验证码
        await SendSms(this.user.mobile)
        // 隐藏获取验证码  显示倒计时
        this.isCountDownShow = true
        // 倒计时结束 关闭倒计时 显示获取验证码  监视finnish事件进行关闭
      } catch (err) {
        // try里面任何错误的代码都会进入catch
        // 不同的错误需要有不同的提示，就需要判断了
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败错误提示
          message = '发送太频繁，请稍后再试'
        } else if (err.name === 'mobile') {
          // 表单验证失败
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        Toast(
          {
            message: message, // 提示消息
            position: 'top' // 防止手机软键盘弹起挡住提示信息
          }
        )
      }
      this.isSendSmsLoading = false // 无论发送成功还是失败，最后都要关闭发送按钮
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
    .send-btn {
        width: 80px;
        height: 20px;
        background-color: #ededed;
        .van-button__text{
            color: #666666;
            font-size: 11px;
        }
    }
    .login-btn-wrap {
        padding: 26px 16px;
        .login-btn {
            background-color: #6db4fb;
            border: none;
            .van-button__text{
                font-size: 15px;
            }
        }

    }
}
</style>

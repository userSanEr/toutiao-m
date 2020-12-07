#### 实现vant组件的自动按需加载
- 首先下载 npm i babel-plugin-import -D
- 直接在babel.config.js中配置
```
module.exports = {
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};
```
- 配置完成之后在组件中使用
先引入：
import { Button } from "vant"
在组件中注册
components: {
    [Button.name]: Button
}
在页面使用
<van-button type="primary">主要按钮</van-button>


#### 移动端适配设置rem基准值
引入插件：npm i -S amfe-flexible
在main.js中进行引入：
import 'amfe-flexible'

#### 进行rem适配
- 引入插件：npm install postcss-pxtorem --save-dev
- 在根文件夹下面建一个文件：postcss.config.js
- 然后在里面写上vant提供的配置：
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8'],
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*'],
    },
  },
};
- 之后当我们在页面中使用px布局时，就会自动转换成rem
- 有个缺点就是行内样式不会自动转化为rem

#### vant中按钮与图标样式组合
<van-button icon="plus" type="primary" /> 此时页面展示的是按钮中放了一个plus的图标
<van-button icon-prefix="toutiao" icon="youjiantou" type="primary"/>  在icon-prefix中设置引入图标的前缀 在icon里面放图标样式

#### axios创建实例
axios.create({})
- {}可以传入你想使用的默认配置
  一般可以将我们默认的路由路径、过期时间等放在这里。
  ```
  const request = axios.create({
      baseURL: 'http://ttapi.research.itcast.cn/'
  })
  ```
- ！！！需要注意的是，当我们创建路由实例之后，所有的关于路由的操作都要使用该变量来进行操作
- 实例创建之后使用：
  ```
  export const login = data => {
      return request({  //对象中存放请求的方式、路径、参数等，也可以设置请求头
          method: 'POST',
          url: '/app/v1_0/authorizations',
          data
      })
  }
  ```

#### 当我们在页面创建js中使用vuex时
- 引入store
  ```
  import store from '@/store'
  ```
- 使用
  ```
  const { user } = store.state
  ```
  
#### 对于用户登录注册携带token等一系列流程
- 用户第一次登录，调用后端登录接口，发送用户名和密码
- 后台验证用户名和密码是否正确，成功的话返回token
- 前端拿到token，将token存在sessionStorage和vuex中，并跳转到主页
 - 存在sessionStorage中，是为了使数据可以持久化保存，
 - 因为一般token的有效期只有两个小时，防止数据被盗
 - 存在vuex中是为了数据可以动态响应，当我们改变数据时，可以同步更新，使用mutations去改变state中的数据状态
 ```
 state: {
    user: getItem(USER_KEY)  //当前用户的登录状态(token等数据)
  },
  mutations: {
    setUser (state, data){
      state.user = data
      setItem(USER_KEY, state.user)
    }
  },
 ```
- 前端每次跳转路由都判断sessionStorage中是否有token，没有则跳转登录页
- 每次调用后端，都要在请求头部添加token
 - 因为每次请求都需要在头部添加token，我们可以使用请求拦截器，判断用户是否为登录状态
 - 可以判断当前缓存中是否有数据或者vuex中，如果存在，则设置header认证
 ```
  request.interceptors.request.use(function (config) {  //config中存放当前请求的所有内容
      const { user } = store.state
      if(user){  
          config.headers.Authorization = `Bearer ${user.token}`  //中间是做拦截请求的操作
      }
      //处理完之后一定要把config返回，否则请求就会停在这里
      return config;
  }, function (error) {
      return Promise.reject(error);
  });
 ```
- 后端判断是否有token，有token，则校验token，验证成功返回数据，验证失败，token过期则返回状态码401，用户去重新登录
- 前端如果得到401，就清楚token跳转登录页


 #### deep
 - 既不是less、也不是scss、也不是css，这是vue单独设置的一个css作用域
 - 任何给组件设置的样式，都会默认作用到它的根节点，建议我们给它加上一个类名，进行覆盖
 - 但是如果我们想要修改它根节点里面的内容样式，就需要加上/deep/深度选择器
 - 深度选择器还可以使用>>>  但是有些像sass、less的不识别这样的标签 纯css中是可以使用的
 - 所以一般使用/deep/ ::v-deep
 - 当你在组件中修改某个组件的样式时，你可以使用非全局和全局样式进行配合使用，但是一般不建议，


 #### ==的隐式转换
对象 -------  字符串  -------  数值 -------  布尔

转换成字符串隐式调用toString()
转换成数值隐式调用valueOf()

在哪种情况下可以打印出来
```
if( a == 1 && a == 2 && a == 3 ){
  console.log('1')
}
```
方法1：
let a: {
  i: 1,
  valueOf () {
    return a.i++
  }
}
方法2：
let a: {
  i: 1,
  toString () {
    return a.i++
  }
}
方法3：
a.join = a.shift
这个意思是指，在每次比较的时候都会去调用一次，a.join方法，因为数组其实也是对象
在使用toString方法时，其实也间接的使用了join的方法，将数组转为字符串
上面那一步，其实是改写数组的a.join方法，将每次调用时改写为提取数组的第一个字符，
而数组的shift方法，本来就是删除数组的第一元素，并返回删除的元素。
这样第一次比较刚好返回1即可实现相等。



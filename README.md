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


#### git命令
可以使用 git status 查看有没有git仓库
vuecli会默认给你创建git仓库，以及做一个名字叫做init的初始提交

删掉之前的远程连接：git remote remove origin
查看远程链接：git remote -v 

- 如果当前本地还没有创建过git仓库
git init 初始化
git add . 
git commit -m "备注内容"
git remote add origin 远程链接
git push -u origin 你的分支名称

- 如果本地已经有了
git add .
git commit
git push


#### 是否封装过单独的组件
- 文章列表
实现上面的每个模块的列表分类
每个列表里面的内容详情
实现上拉加载、下拉刷新、错误处理等

在实现下拉刷新时，我们可以通过向后台传递要加载的页数
或者在每次返回数据时，传一个时间戳，表示还有下一页数据

#### .editorconfig 
用来给所写的编码进行代码格式化，当在某个项目配置这个之后，就会对当前项目起作用

#### referer 403
referer是http请求头的一部分，当浏览器向web服务器发送请求时，一般会带上referer，它包含了当前请求资源的来源页面的地址，
服务端一般使用referer请求头识别访问来源，可能会以此进行统计分析、日志记录或缓存优化等。
当我们在向某个服务器发送请求返回403状态码时，此时就是因为你请求的这个服务器要求必须是人家认识的才会给你资源
解决办法：
我们可以将referer去掉，此时发送请求时就不会带着referer也就是来源页面的地址，这样他可能认为你就是来源于自己熟悉的客户端，则会给你资源
去掉referer的方法
在说写法之前，我们需要明确referer其实是错误的写法，正确的写法应该是referrer，这个是推荐人的意思
所以在去掉这个的时候，一般都会使用正确的写法：
- 用 <a>、<area>、<img>、<iframe>、<script> 或者 <link> 元素上的 referrerpolicy 属性为其设置独立的请求策略，例如：
```
<img src="http://……" referrerPolicy="no-referrer">
```
- 或者直接在 HTMl 页面头中通过 meta 属性全局配置：
```
<meta name="referrer" content="no-referrer" />
```
还有更完善的配置方法，可参考链接：http://www.ruanyifeng.com/blog/2019/06/http-referer.html


#### lodash 第三方安装包 
里面有我们常用的js函数工具
一般使用_来指代该函数的名字
`import _ from 'lodash'`
按需引入，则在打包时，就只会将我们用到的这个组件打包进来
`import { debounce } from 'lodash'`
使用debounce包裹函数
handler: debounce(async function{})

#### 使用命名函数配合async
handler: async function(){}





# uni-crazy-router  
一个更贴合uni-app的router插件，一切都使用uni-app原生钩子实现和方法实现，抛弃了vue-router的影子

<img src="https://account.weimob.com/img/logo.svg">  

`微盟营销云技术部前端团队提供技术支持`     

问题反馈QQ群:701697982 <a target="_blank" href="https://jq.qq.com/?_wv=1027&k=2DjrpVZL" rel="nofollow"><img src="http://pub.idqqimg.com/wpa/images/group.png" alt="uniapp2wxpack问题反馈群"></a>  


## [详细文档请访问](https://github.com/devilwjp/uni-crazy-router)  
[https://github.com/devilwjp/uni-crazy-router](https://github.com/devilwjp/uni-crazy-router)  
    
___
## 注意  
由于条件限制，仅在H5环境和微信小程序环境、以及app端android和ios环境进行过测试  
感谢某位网友（QQ:85347325）一起帮忙进行了android和ios环境的测试  
感谢某位网友（QQ:675147705）一起进行了android设备首页两次返回的bug测试  
___
## 优势  
+ uni-crazy-router是一个Vue的插件，安装和使用方便，是一个非常轻量级的路由插件  
+ 不需要配置路由表  
+ 使用的都是uni-app原生的跳转方法，不需要修改成vue-router的方式，直接使用uni.navigateTo等原生方法就可以进行跳转  
+ 完全使用uni-app自身的钩子和属性实现，不耦合于vue的组件，更不依赖vue-router  
+ beforeEach可以异步拦截路由的跳转
+ 新增路由级别的params参数，不耦合于uni-app自身的页面参数  
+ 对页面跳转进行了防抖防刷新的处理，避免了小程序可以连续疯狂点击触发窗口的问题
     
## 安装  
```
npm i uni-crazy-router -S
```  
  
## 引入  
```javascript
// 全文件引入(17K)
import uniCrazyRouter from "uni-crazy-router"

// 小文件引入(8K)（推荐小程序和h5使用，app会报require错误）
import uniCrazyRouter from "uni-crazy-router/dist/small"
```

___
## 配置  
### 第一步  
uni-app项目 src/main.js  
```javascript
import Vue from 'vue'
import App from './App'
import './router' // 引入路由
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
```  
  
### 第二步  
创建src/router/index.js
```javascript
import Vue from 'vue'
import uniCrazyRouter from "uni-crazy-router";
Vue.use(uniCrazyRouter)

uniCrazyRouter.beforeEach(async (to, from ,next)=>{
    // 逻辑代码
    
    next()
})

uniCrazyRouter.afterEach((to, from)=>{
    // 逻辑代码
})

uniCrazyRouter['on'+'Error']((to, from)=>{
    // 逻辑代码
})
```  
  
### 第三步  
通过原生方法触发跳转  
```javascript
uni.navigateTo({
    url: '/pages/test/test?a=1&b=1', // 不影响原生的参数传递
    // 提供了基于页面级别的路由参数对象
    routeParams: {
        c:1,
        d:1
    },
    // 提供了基于跳转过程的过程参数对象
    passedParams: {
        e:1,
        f:1
    }
})
```  
  
### 第四步  
在页面中获取相关信息  
```javascript
export default {
    data() {
        return {
            title: 'Hello'
        }
    },
    onLoad() {
        // 获取页面路由
        // uni-app官方推荐方式，适用所有端
        console.log(getCurrentPages()[getCurrentPages().length-1].route)
    },
    ['on'+'Show']() {
        // 获取路由页面参数
        console.log(this.$routeParams)
        console.log(getCurrentPages()[getCurrentPages().length-1].$routeParams)
        // 获取路由动作过程参数
        console.log(this.$passedParams)
        console.log(getCurrentPages()[getCurrentPages().length-1].$passedParams)
    },
    methods: {
        //....
    }
}
```
___
## API  
### 路由切换的API（原生）  
**uni.navigateTo  
uni.redirectTo  
uni.reLaunch  
uni.switchTab  
uni.navigateBack**  
  
#### 新增参数  
+ routeParams {Object} 路由触发的页面参数，在页面加载后将一直存在并且不再改变  
+ passedParams {Object}  路由触发的过程参数，每次通过主动触发路由的改变，就会被修改  
routeParams和passedParams的值可以在页面vue实例中通过$routeParams和$passedParams获取(比如this.$routeParams)，也可以通过getCurrentPages()获取到页面栈中的页面对象，对象中同样存在$routeParams和$passedParams  
+ query {Object} 原生的url参数  
  
### 钩子函数与拦截器  
钩子函数和拦截器与vue-router的使用方式雷同，开放了三个钩子  
+ beforeEach (hookFunction)  
**路由拦截中的next用法于vue-router有所不同，next暂时不接受参数，调用next代表不拦截，如果函数中没有调用next，代表了拦截，beforeEach接受的函数参数是个async函数，意味着函数中即便需要使用异步也必须包装成promise的形式，使用await获取异步的结果，不能直接使用回调性质的异步比如setTimeout等，因为只要整个async函数返回前没有调用next，就会当作拦截了，在拦截时需要跳转到其他页面，需要使用afterNotNext进行包装（详见afterNotNext）**  
PS: 之后的1.0.0以上的版本会开放和vue-router一样的拦截函数方式，可以不使用promise包装异步  
+ afterEach (hookFunction)  
+ on Error (hookFunction)  
**其中beforeEach有拦截功能，通过next方法来控制  
beforeEach只能拦截主动的路由切换（由路由切换API触发）  
被动触发行为不会经过beforeEach，包括：**  
+ 小程序的原生返回按钮触发  
+ 小程序的navigator组件触发  
+ 小程序的返回首页按钮  
+ 小程序的tabbar按钮  
+ 浏览器的前进后退按钮  
+ APP端IOS环境下，向右滑动返回的方式（并且也无法触发afterEach）  
  
#### 参数   
hookFunction {Function}
+ to  {Object} {url, routeParams, passedParams, query, jumpType}  
其中jumpType只有在beforeEach中出现，用于标识主动触发的类型（原生方法名）
+ from  {Object} {url, routeParams, passedParams}
+ next  {Function} 只有beforeEach才有
  
### 拦截后的附加执行函数  
**afterNotNext (hookFunction)**  
afterNotNext只对当前函数上下文有效  
#### 参数  
hookFunction {Function} 在beforeEach被拦截后同步执行  
用在beforeEach拦截中，当遇到没有next的场景，会在拦截动作之后同步的触发传入的函数  
因为uni-crazy-router做了防抖重复动作拦截，所以如果想在before里使用路由跳转动作，需要包装在afterNotNext里  
```javascript
uniCrazyRouter.beforeEach(async (to, from ,next)=>{
    if (to.passedParams && to.passedParams.stop) {
        uniCrazyRouter.afterNotNext(() => {
            // 拦截路由，并且跳转去其他页面
            uni.navigateTo({
                url: '/pages/other/other'
            })
        })
        return // 拦截路由，不执行next
    }
    next()
})
```  
## 其他  
获取当前页面的路径，请使用uni-app官方推荐的方式，不再重复包装  
官方推荐通过getCurrentPages获取页面栈的页面对象，然后获取route属性

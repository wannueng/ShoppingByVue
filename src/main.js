import Vue from 'vue'
import App from './App.vue'
// 引入路由模块
import VueRouter from 'vue-router'
// 引入index组件
import index from './components/index'
//引入goodInfo 组件
import goodsInfo from './components/goodsInfo'
import buyCar from './components/buyCar'
import payorder from './components/payorder'
import orderinfo from './components/orderinfo'
import paySuccess from './components/paySuccess'
import personalCenter from './components/personalCenter'
import orderCenter from './components/orderCenter'
import orderDetal from './components/orderDetal'

//引入login组件
import login from './components/login'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueLazyload from 'vue-lazyload'
import axios from 'axios'

import moment from 'moment';

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import Vuex from 'vuex';

axios.defaults.baseURL = 'http://47.106.148.205:8899';
// 设置带上cookie
axios.defaults.withCredentials = true
Vue.prototype.axios = axios

// 使用路由中间件

Vue.use(VueRouter)
// 使用element-ui
Vue.use(ElementUI);
Vue.use(VueLazyload, {
  loading: require('./assets/01.gif'),
});
Vue.use(iView);
//使用vuex
Vue.use(Vuex);
const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: 'index'
    },
    {
      path: '/index',
      component: index
    },
    {
      path: '/goodsInfo/:id',
      component: goodsInfo
    },
    {
      path: '/buyCar',
      component: buyCar
    },
    {
      path: '/payorder/:ids',
      component: payorder,
      //路由元信息，定义路由的时候可以配置 meta 字段，
      meta: {
        needLogin: true
      }
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/orderinfo/:orderid',
      component: orderinfo,
      //路由元信息，定义路由的时候可以配置 meta 字段，
      meta: {
        needLogin: true
      }
    },
    {
      path: '/paySuccess',
      component: paySuccess,
      //路由元信息，定义路由的时候可以配置 meta 字段，
      meta: {
        needLogin: true
      }
    },
    {
      path: '/personalCenter',
      component: personalCenter,
      //路由元信息，定义路由的时候可以配置 meta 字段，
      meta: {
        needLogin: true
      }
    },
    {
      path: '/orderCenter',
      component: orderCenter,
      //路由元信息，定义路由的时候可以配置 meta 字段，
      meta: {
        needLogin: true
      }
    },
    {
      path: '/orderDetal/:id',
      component: orderDetal,
      //路由元信息，定义路由的时候可以配置 meta 字段，
      meta: {
        needLogin: true
      }
    },
  ]
})
//过滤器
Vue.filter('cuttime', function (value,myformat) {
  if(myformat){
    return moment(value).format(myformat);
  }else{
    return moment(value).format('YYYY-MM-DD')

  }
})
// 判断数据是否存在
let buyList = JSON.parse(window.localStorage.getItem('buyList')) || {};

//实例化一个vuex仓库
const store = new Vuex.Store({
  state: {
    buyList,
    // 是否登陆
    isLogin: false,
    // 来的路由
    fromPath: '/'
  },

  // 类似于computed的属性
  getters: {
    totalCount(state) {
      let num = 0;
      // 遍历对象
      for (const key in state.buyList) {
        // 累加总数
        num += parseInt(state.buyList[key]);
      }
      return num;
    }
  },
  //状态变更
  mutations: {
    buyGood(state, info) {
      if (state.buyList[info.goodId]) {
        // 解决字符串累加问题
        let oldNum = parseInt(state.buyList[info.goodId]);
        oldNum += parseInt(info.goodNum);
        // 重新赋值
        state.buyList[info.goodId] = oldNum;
      } else {
        // 没有 直接赋值这种方法 vue不会跟踪属性
        // state.buyList[info.goodId]=info.goodNum;
        // 需要使用 Vue.set(obj, 'newProp', 123) 替代
        Vue.set(state.buyList, info.goodId, parseInt(info.goodNum));
      }
    },
    // 直接更新 某个id对应的数值
    // {goodId:xx,goodNum:xxx}
    changeCount(state, info) {
      state.buyList[info.goodId] = info.goodNum;
    },
    delGoodById(state, id) {
      // 告诉Vue我已经删除了这个属性
      Vue.delete(state.buyList, id);
    },
    rememberFromPath(state, path) {
      state.fromPath = path;
    },
    changeLogin(state, login) {
      state.isLogin = login;
    }

  },
});

router.beforeEach((to, from, next) => {
  // 从哪来
  // console.log(from);
  //保存数据
  store.commit('rememberFromPath', from.path);
  //去订单支付页
  if (to.meta.needLogin) {
    axios.get("/site/account/islogin")
      .then(response => {
        console.log(response);
        if (response.data.code == "nologin") {
          console.log('没登录');
          next('/login');
        } else {
          next();
        }
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    //如果去的不是登录页。直接可以访问
    next();
  }

})




// 引入css
import './assets/statics/site/css/style.css';
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  //生命周期函数：页面一进来的时候，调用接口，判断有没登录
  beforeCreate() {
    axios.get('/site/account/islogin')
      .then(response => {
        console.log(response);
        // if(response.data.code=='logined'){
        //   // 说明是登录了，
        // }
        store.state.isLogin = response.data.code == 'logined';
      })
      .catch(err => {
        console.log(err);
      })
  }
}).$mount('#app')
//注册一些逻辑
window.onbeforeunload = function () {
  window.localStorage.setItem('buyList', JSON.stringify(store.state.buyList))
}
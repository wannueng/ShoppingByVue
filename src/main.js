import Vue from 'vue'
import App from './App.vue'
// 引入路由模块
import VueRouter from 'vue-router'
// 引入index组件
import index from  './components/index'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueLazyload from 'vue-lazyload'
import path from 'path'
// 使用路由中间件
Vue.use(VueRouter)
// 使用element-ui
Vue.use(ElementUI);
Vue.use(VueLazyload,{
  loading: path.join(__dirname,'/assets/01.gif'),
});
const router=new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'index'
    },
    {
    path:'/index',
    component:index
  }
]
})


// 引入css
import './assets/statics/site/css/style.css';
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

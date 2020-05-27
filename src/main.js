// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import 'assets/custom-theme/index.css'; // 换肤版本element-ui css
import './styles/element-variables.scss'; // 换肤版本element-ui css
import App from './App';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import 'normalize.css/normalize.css';// normalize.css 样式格式化
import 'assets/iconfont/iconfont'; // iconfont 具体图标见https://github.com/PanJiaChen/vue-element-admin/wiki
import * as filters from './filters'; // 全局vue filter
import Multiselect from 'vue-multiselect';// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css';// 多选框组件css
import Sticky from 'components/Sticky'; // 粘性header组件
import IconSvg from 'components/Icon-svg';// svg 组件
import vueWaves from './directive/waves';// 水波纹指令
import errLog from 'store/errLog';// error log组件
import './mock';  // 该项目所有请求使用mockjs模拟
import { getToken,setToken } from 'utils/auth';
import vueQuillEditor from 'vue-quill-editor'; // 引入富文本工具
import {quillRedefine} from 'vue-quill-editor-upload';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import moment from 'moment';
import VueAMap from 'vue-amap';
//import echarts from 'echarts'; // 引入echarts
import Clipboard from 'v-clipboard'
import i18n from './i18n/i18n'


// register globally
Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
Vue.component('icon-svg', IconSvg)
Vue.use(ElementUI);
Vue.use(Clipboard)
Vue.use(vueWaves);
Vue.use(vueQuillEditor);
Vue.use(VueAMap);
//Vue.prototype.$echarts = echarts;

VueAMap.initAMapApiLoader({
    key: '7cf82bdb7663962d35af7c335e829a6b',
    plugin: [
        'AMap.Autocomplete',
        'AMap.PlaceSearch',
        'AMap.Scale',
        'AMap.OverView',
        'AMap.ToolBar',
        'AMap.MapType',
        'AMap.PolyEditor',
        'AMap.CircleEditor',
        'AMap.Geolocation'
    ],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4'
});
import Element from 'element-ui'
Vue.use(Element, {
    size: 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

// register global progress.
const whiteList = ['/login', '/signin'];// 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (store.getters.userMenus === undefined) { // 判断当前用户是否已拉取完用户相关信息
        store.dispatch('GetInfos').then(data => { // 拉取用户相关信息

          const userMenus = {};
          for (let i = 0; i < data.menus.length; i++) {
            userMenus[data.menus[i].code] = true;
          }
          store.dispatch('GenerateRoutes', userMenus).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to }); // hack方法 确保addRoutes已完成
          })
        }).catch(() => {
          store.dispatch('FedLogout').then(() => {
            next({ path: '/login' });
          })
        })
      } else {
      //  else {
      //   // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      //   if (hasPermission(store.getters.roles, to.meta.role)) {
      //     next();//
      //   } else {
        next();
      //   }
      //   // 可删 ↑
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login'); // 否则全部重定向到登录页
      NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

Vue.config.productionTip = false;

// 生产环境错误日志
if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if(null == dataStr){
    return "";
  }
  return moment(dataStr).format(pattern)

});

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App },
    data:function () {
      return {
          timerRun:false,
      }
    }
})




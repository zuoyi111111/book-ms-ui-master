import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import iconPicker from 'vue-fontawesome-elementui-icon-picker'
import {postRequest} from "./utils/request"
import {postKeyValueRequest} from "./utils/request"
import {putRequest} from "./utils/request"
import {deleteRequest} from "./utils/request"
import {getRequest} from "./utils/request"
import router from "./router"
import db from "./utils/sessionStorage"
import * as config from "./utils/config"
import vueSwiper from 'vue-awesome-swiper'  //引入vue-awesome-swiper
import 'swiper/dist/css/swiper.css'  //引入样式

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(iconPicker)
Vue.use(vueSwiper)  //使用插件

Vue.prototype.db = db
Vue.prototype.config = config
Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

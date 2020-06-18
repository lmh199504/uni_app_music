import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
Vue.prototype.$store = store;
import * as Api from './config/api.js'
Vue.prototype.$Api = Api;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

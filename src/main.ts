import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Icon from '@/components/common/Icon.vue';
import Layout from '@/components/common/Layout.vue';
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
Vue.config.productionTip = false
Vue.component('Icon',Icon)
Vue.component('Layout',Layout)
store.commit('fetchRecordList');
store.commit('fetchTagList');
store.commit('fetchCategory')
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

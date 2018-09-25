import Vue from 'vue'
import './plugins/vuetify'
import './plugins/axios'
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { idx } from './mymodules/idb'

Vue.config.productionTip = false

new Vue({
  render: h => h(App, { props: { idx } })
}).$mount('#app')

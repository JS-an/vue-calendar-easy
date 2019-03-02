import Vue from 'vue'
import App from './calendar.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

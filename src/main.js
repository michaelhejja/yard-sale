import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createWebHistory, createRouter } from 'vue-router'
import store from './store'

import HomeView from './components/HomeView.vue'
import YardSaleView from './components/YardSaleView.vue'
import Dashboard from './components/DashboardView.vue'
import OrdersView from './components/OrdersView.vue'
import Products from './components/ProductsView.vue'
import TermsView from './components/TermsView.vue'
import FaqView from './components/FaqView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/yardsale', component: YardSaleView },
  { path: '/products', component: Products },
  { path: '/terms', component: TermsView },
  { path: '/faqs', component: FaqView },
  { path: '/dashboard', component: Dashboard },
  { path: '/orders', component: OrdersView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0 }
  }
})

createApp(App)
.use(router)
.use(store)
.mount('#app')

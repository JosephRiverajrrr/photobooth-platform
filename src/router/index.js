import { createRouter, createWebHistory } from 'vue-router'

import AdminLogin from '../views/LoginPage.vue'
import AdminDashboard from '../views/Admin/DashboardPage.vue' 
//customer

import WelcomePage from '../views/Customers/WelcomePage.vue'
import SelectTemplate from '../views/Customers/SelectTemplate.vue'
import CameraView from '../views/Customers/CameraView.vue'
import ResultView from '../views/Customers/ResultView.vue'

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/select-template', component: SelectTemplate },
  { path: '/camera-view', component: CameraView },
  { path: '/result-view', component: ResultView },
  { path: '/admin-login', component: AdminLogin },
  { path: '/admin', component: AdminDashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
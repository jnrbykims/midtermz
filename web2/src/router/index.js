import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../components/pages/Dashboard.vue'
import Form from '../components/pages/Form.vue'
import Profile from '../components/pages/About.vue'
import Login from '../components/pages/Login.vue'
import Signup from '../components/pages/Signup.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/dashboard' 
  },
  { 
    path: '/dashboard', 
    name: 'dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/form', 
    name: 'form', 
    component: Form,
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile', 
    name: 'profile', 
    component: Profile,
    meta: { requiresAuth: true }
  },

  {
    path: '/supabase',
    name: 'supabase',
    component: () => import('../views/Supabase.vue')

  },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup },
]
  

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const userData = localStorage.getItem('userData')
  const isAuthenticated = userData ? JSON.parse(userData).isLoggedIn : false

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
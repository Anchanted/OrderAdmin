import Vue from 'vue'
import VueRouter from 'vue-router'
import Meal from '../views/Meal.vue'
import DeOrderHistory from '../views/DeOrderHistory.vue'
import OrderDaily from '../views/OrderDaily.vue'
import OrderHistory from '../views/OrderHistory.vue'
import Login from '../views/Login.vue'
import Users from '../views/user/Users.vue'
import Limits from '../views/Limits.vue'
import PageNotFound from '../views/404'


Vue.use(VueRouter)

const routes = [
  {
    path: "*",
    component: PageNotFound,
    name: 'PageNotFound'
  },
  {
    path: '/meal',
    name: 'Meal',
    component: Meal
  },
  {
    path: '/deOrderHistory',
    name: 'DeOrderHistory',
    component: DeOrderHistory
  },
  {
    path: '/orderDaily',
    name: 'OrderDaily',
    component: OrderDaily
  },
  {
    path: '/orderHistory',
    name: 'OrderHistory',
    component: OrderHistory
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    // children: [
    //   {
    //     path: "all",
    //     component: UserAll
    //   },
    //   {
    //     path: "single",
    //     component: UserSingle
    //   }
    // ]
  },
  {
    path: '/limits',
    name: 'Limits',
    component: Limits
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  base: process.env.NODE_ENV === "production" ? "/ordermeal/" : "/",
  routes
})

export default router

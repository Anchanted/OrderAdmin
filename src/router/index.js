import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'

import Meal from 'views/Meal.vue'
import EmployeeOrder from 'views/EmployeeOrder.vue'
import DailyOrder from 'views/DailyOrder.vue'
import HistoryOrder from 'views/HistoryOrder.vue'
import Login from 'views/Login.vue'
import User from 'views/user/User.vue'
import PageNotFound from 'views/404'

Vue.use(VueRouter)

const routes = [
    {
        path: "*",
        component: PageNotFound,
        name: 'PageNotFound',
        meta: {
            hideNav: true
        }                       
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta:{
            hideNav: true
        }
    },
    {
        path: '/',
        name: 'Meal',
        component: Meal
    },
    {
        path: '/dailyorder',
        name: 'DailyOrder',
        component: DailyOrder
    },
    {
        path: '/historyorder',
        name: 'HistoryOrder',
        component: HistoryOrder
    },
    {
        path: '/employeeorder',
        name: 'EmployeeOrder',
        component: EmployeeOrder
    },
    {
        path: '/user',
        name: 'User',
        component: User,
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
    }
]

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    base: process.env.NODE_ENV === "production" ? "/ordermeal/" : "/",
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name !== "Login" && store.state.user == null) next({ name: "Login" })
    else next()
})

export default router

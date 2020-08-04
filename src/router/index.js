import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'

import Meal from 'views/Meal.vue'
import StaffOrder from 'views/StaffOrder.vue'
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
        path: '/stafforder',
        name: 'StaffOrder',
        component: StaffOrder
    },
    {
        path: '/user',
        name: 'User',
        component: User,
    }
]

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    base: process.env.NODE_ENV === "production" ? "/ordermeal/" : "/",
    routes
})

router.beforeEach((to, from, next) => {
    if (!from.name) {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user) store.commit("setUser", user)
    }

    const now = new Date()
    const expireDate = new Date(store.state.user?.expireDate || now)
    if (expireDate <= now) store.commit("setUser", null)

    if (!store.state.user) {
        if (to.name !== "Login") next({ name: "Login" })
        else next()
    }
    else {
        if (to.name === "Login") next({ path: "/" })
        else next()
    }
})

export default router

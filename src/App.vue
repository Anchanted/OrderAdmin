<template>
    <div id="app">
        <div class="content-page" v-if="!$route.meta.hideNav">
            <div class="vertical-navbar border-right border-secondary">
                <div class="system-title text-white">订餐后台管理</div>
                <b-list-group>
                    <b-list-group-item :to="{ name: 'Meal' }" :active="$route.name === 'Meal'">餐品维护</b-list-group-item>
                    <b-list-group-item :to="{ name: 'DailyOrder' }" :active="$route.name === 'DailyOrder'">部门当日订餐单据</b-list-group-item>
                    <b-list-group-item :to="{ name: 'HistoryOrder' }" :active="$route.name === 'HistoryOrder'">部门历史订单统计</b-list-group-item>
                    <b-list-group-item :to="{ name: 'StaffOrder' }" :active="$route.name === 'StaffOrder'">部门员工订单详情</b-list-group-item>
                    <b-list-group-item :to="{ name: 'User' }" :active="$route.name === 'User'">用户管理</b-list-group-item>
                </b-list-group>
            </div>
            <div class="content">
                <div v-if="user != null" class="top-bar">
                    <div>欢迎，{{user.username}}</div>
                    <b-button variant="link" @click="logout">登出</b-button>
                </div>
                <b-link v-else :to="{ name: 'Login' }">登录</b-link>
                <router-view />
            </div>
        </div>
        <router-view v-else/>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    computed: {
        ...mapState({
            user: state => state.user,
            apiStationList: state => state.apiStationList,
            apiWellList: state => state.apiWellList,
            apiRoleList: state => state.apiRoleList
        })
    },
    methods: {
        logout() {
            localStorage.removeItem("user")
            this.$store.commit("setUser", null)
            this.$router.push({
                name: "Login"
            })
        }
    },
    watch: {
        $route: {
            immediate: true,
            deep: true,
            handler: function(to, from) {
                if (to.name !== "Login" && to.name !== "PageNotFound") {
                    if (!this.apiStationList.length) {
                        console.log("update station list")
                        this.$api.get("api/Station/Id")
                            .then(data => {
                                console.log(data)
                                this.$store.commit("setApiStationList", data.data)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                    if (!this.apiWellList.length) {
                        console.log("update well list")
                        this.$api.get("api/Well/Id")
                            .then(data => {
                                console.log(data)
                                this.$store.commit("setApiWellList", data.data)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                    if (!this.apiRoleList.length) {
                        console.log("update role list")
                        this.$api.get("api/Role/Id")
                            .then(data => {
                                console.log(data)
                                this.$store.commit("setApiRoleList", data.data)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss">
html, body {
    width: 100%;
    height: 100%;
    font-size: 16px;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100%;
    height: auto;
    min-height: 100%;
    position: absolute;
    color: #6c757d;
    background-color: #fafbfe;

    .content-page {
        width: 100%;
        height: auto;
        min-height: 100%;
        padding-left: 300px;
        display: flex;

        .vertical-navbar {
            width: 300px;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            flex-shrink: 0;
            background-color: #313a46;

            .system-title {
                height: 70px;
                line-height: 70px;
                font-size: 1.5rem;
                font-weight: bold;
            }

            .list-group-item {
                padding: 20px;
                font-size: 1.2rem;
                border-left: none;
                border-right: none;
                background-color: #313a46;
                color: #8391a2;
            }

            .list-group-item.active {
                color: #ffffff;
                border-color: rgba(0, 0, 0, 0.125);
            }

            .list-group-item-action {
                &:hover, &:focus {
                    background-color: #727df5;
                    color: #ffffff;
                }
            }
        }

        .content {
            height: auto;
            background-color: #fafbfe;
            flex-grow: 1;
            padding: 70px 20px 0;
            position: relative;

            >div {
                position: relative;
            }

            .top-bar {
                width: 100%;
                height: 70px;
                padding: 0 20px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                background-color: #ffffff;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }

}

</style>

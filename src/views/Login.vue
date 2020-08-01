<template>
    <div id="wrapper">
        <nav class="navbar navbar-default top-navbar" role="navigation">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <div class="navbar-brand"><strong>订餐后台管理</strong></div>
		        <div id="sideNav" href=""><i class="fa fa-caret-right"></i></div>
            </div>

        <ul class="nav navbar-top-links navbar-right">
            <!-- /.dropdown -->
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
                    <i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i>
                </a>
                <ul class="dropdown-menu dropdown-user">
                        <li><router-link to="/login"><i class="fa fa-user fa-fw"></i>登录</router-link></li>
                        <li><router-link to="/login"><i class="fa fa-user fa-fw"></i> 用户管理</router-link></li>
                        <!-- <li><router-link to="/limits"><i class="fa fa-gear fa-fw"></i> 权限管理</router-link></li> -->
                </ul>
                <!-- /.dropdown-user -->
            </li>
            <!-- /.dropdown -->
        </ul>
    </nav>
    <!--/. NAV TOP  -->
    <nav class="navbar-default navbar-side" role="navigation">
        <div class="sidebar-collapse">
            <ul class="nav" id="main-menu">
                <!--
                    <li>
                        <router-link to="/"><i class="fa fa-dashboard"></i>总览</router-link>
                    </li>
                -->
                    <li>
                        <router-link to="/login"><i class="fa fa-desktop"></i>餐品维护表</router-link>
                    </li>
                    <li>
                        <router-link to="/login"><i class="fa fa-bar-chart-o"></i>订餐当天统计表</router-link>
                    </li>
                    <li>
                        <router-link to="/login"><i class="fa fa-qrcode"></i>订餐历史统计表</router-link>
                    </li>
                    <li>
                        <router-link to="/login"><i class="fa fa-table"></i>部门订餐历史统计表</router-link>
                    </li>
            </ul>
        </div>

    </nav>
    <!-- /. NAV SIDE  -->
        <div id="page-wrapper">
            <div id="page-inner">
                <div>
                    <form @submit.prevent="login">
                        <table align="center" valign="center" width="50%" border="0">
                            <tr class="biaoti" style="width: 10%;height: 40px;font-size: 40px;">用户登录</tr>
                        </table>
                        <table align="center" valign="center" width="50%" border="0">
                            <tr>
                                <td bgcolor="#4682B4" style="height: 40px;font-size: 20px;align-content: center;" border="1">
                                    账号：
                                </td>
                                <td>
                                    <input bgcolor="#6A5ACD" type="text" name="username" placeholder="请输入账号" style="width: 100%;height: 40px;font-size: 20px;"
                                        v-model="username">
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#4682B4" style="height: 40px;font-size: 20px;" border="1">
                                    密码：
                                </td>
                                <td>
                                    <input bgcolor="#6A5ACD" type="password" name="password" placeholder="请输入密码" style="width: 100%;height: 40px;font-size: 20px;"
                                        v-model="password">
                                <!-- type="password"-->
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" rowspan="3" style="align-content: center;width: 80%;height: 40px">
                                    <input type="submit" value="登录">
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
                <div v-if="failure" style="color: red;">用户名或密码错误</div>
            </div>
        <!-- /. PAGE INNER  -->
        </div>
    <!-- /. PAGE WRAPPER  -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            failure: false
        }
    },

    methods: {
        login() {
            // { telephone: "13833759376", password: "010337" }
            this.$api.post("/api/ulogin", { telephone: this.username, password: this.password })
                .then(data => {
                    console.log(data)
                    console.log("跳转页面")
                    this.$router.push({
                        name: "Meal"
                    })
                })
                .catch(error => {
                    this.failure = true
                    console.log(error)
                })
        }
    },
    mounted() {
        // this.login()
    }
}
</script>

<style>
</style>
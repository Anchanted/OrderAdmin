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
               
				

            </div>

            <ul class="nav navbar-top-links navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
                        <i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-user">
                        <li><router-link to="/login"><i class="fa fa-user fa-fw"></i>登录</router-link></li>
                        <li><router-link to="/users"><i class="fa fa-user fa-fw"></i> 用户管理</router-link></li>
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
                        <router-link to="/" class="active-menu"><i class="fa fa-dashboard"></i>总览</router-link>
                    </li>
                    -->
                    <li>
                        <router-link to="/meal"><i class="fa fa-desktop"></i>餐品维护表</router-link>
                    </li>
                    <li>
                        <router-link to="/orderDaily"><i class="fa fa-bar-chart-o"></i>订餐当天统计表</router-link>
                    </li>
                    <li>
                        <router-link to="/orderHistory"><i class="fa fa-qrcode"></i>订餐历史统计表</router-link>
                    </li>
                    <li>
                        <router-link to="/deorderHistory"><i class="fa fa-table"></i>部门订餐历史统计表</router-link>
                    </li>
                </ul>
            </div>

        </nav>
        <!-- /. NAV SIDE  -->
      
		<div id="page-wrapper">
		    <div class="header"> 
                        <h1 class="page-header">
                            权限设置 <small>Welcome </small>
                        </h1>
					<ol class="breadcrumb">
					  <li>主页</li>
					  <li>用户</li>
					  <li class="active">设置</li>
					</ol> 
									
	        </div>
            <div id="page-inner">
                
            </div>
        </div>
    </div>
            <!-- /. PAGE INNER  -->
</template>

<script>
export default {

}
</script>

<style>
</style>
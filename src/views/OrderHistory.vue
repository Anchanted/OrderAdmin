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
                        <router-link to="/"><i class="fa fa-dashboard"></i>总览</router-link>
                    </li>
                    -->
                    <li>
                        <router-link to="/meal"><i class="fa fa-desktop"></i> 餐品维护表</router-link>
                    </li>
                    <li>
                        <router-link to="/orderDaily"><i class="fa fa-bar-chart-o"></i>订餐当天统计表</router-link>
                    </li>
                    <li>
                        <router-link to="/orderHistory" class="active-menu"><i class="fa fa-qrcode"></i>订餐历史统计表</router-link>
                    </li>

                    <li>
                        <router-link to="/deorderHistory"><i class="fa fa-table"></i> 部门订餐历史统计表</router-link>
                    </li>
                </ul>
            </div>
        </nav>
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tr>
                        <td align="center" class="biaoti" height="60">订餐历史统计表</td>
                    </tr>
                </table>
                <div class="personalReport_time" align="left">
                    <input type="date" :max="endTime" value="" v-model="startTime"/>
                    <input type="date" :min="startTime" :max="maxTime" v-model="endTime"/>
                    <button @click="query" class="but">查询</button>
                    <!-- <button align="right" type="primary" v-on:click="exportExcel()">导出表格</button> -->
                </div>
                <div align="right">
                    <button type="primary" v-on:click="exportExcel()">导出表格</button>
                </div>
                <table width="100%" border="2" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center">
                    <tr>
                        <td width="4%" class="btbg font-center titfont" >日期</td>
                        <td width="5%" class="btbg font-center titfont" >二级单位</td>
                        <td width="2%" class="btbg font-center titfont" >早餐A</td>
                        <td width="2%" class="btbg font-center titfont" >早餐B</td>
                        <td width="2%" class="btbg font-center titfont">午餐A大份</td>
                        <td width="2%" class="btbg font-center titfont">午餐A小份</td>
                        <td width="2%" class="btbg font-center titfont">午餐B大份</td>
                        <td width="2%" class="btbg font-center titfont">午餐B小份</td>
                        <td width="2%" class="btbg font-center titfont">晚餐A大份</td>
                        <td width="2%" class="btbg font-center titfont">晚餐A小份</td>
                        <td width="2%" class="btbg font-center titfont">晚餐B大份</td>
                        <td width="2%" class="btbg font-center titfont">晚餐B小份</td>
                    </tr>
                    <template v-for="(order, index) in orderList">
                        <tr :key="`${index}-0`">
                            <td rowspan="2">{{order.date}}</td>
                            <td rowspan="2">{{order.station}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                        </tr>
                        <tr :key="`${index}-1`">
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                            <td>{{order.num}}</td>
                        </tr>
                    </template>
                    
                    <tr>
                        <td width="4%" class="btbg2">汇总</td>
                        <td width="5%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            orderList: [
                {
                    date: "7.22",
                    station: "勘探处",
                    num: 20
                },
                {
                    date: "7.23",
                    station: "办公室",
                    num: 20
                }
            ],
            startTime: "",
            endTime: "",
            maxTime: ""
        }
    },
    methods:{
        // 导出表格
        exportExcel() {
        require.ensure([], () => {
            const { export_json_to_excel } = require("../excel/Export2Excel.js");

            const tHeader = ["日期", "二级单位", "早餐A","数量", "早餐B","数量", "午餐A大份","数量", "午餐A小份","数量", "午餐B大份","数量", "午餐B小份","数量"];// 上面设置Excel的表格第一行的标题
      
            const filterVal = ["id", "time", "img","hhh"]; // 上面的index、nickName、name是tableData里对象的属性
        
            const list = this.orderList;              //把data里的tableData存到list

            const data = this.formatJson(filterVal, list);
        
            export_json_to_excel(tHeader, data, "列表excel");   //标题，数据，文件名
            });
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
        },
        //获取时间、
        //时间解析;
        Time:function(now)  {
            let year=new Date(now).getFullYear();
            let month=new Date(now).getMonth()+1;
            let date=new Date(now).getDate();
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            return  year+"-"+month+"-"+date
        },
        //本周第一天；
        showWeekFirstDay:function(){
            let Nowdate=new Date();
            let WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
            let M=Number(WeekFirstDay.getMonth())+1;
            if(M<10){
                M="0"+M;
            }
            let D=WeekFirstDay.getDate();
            if(D<10){
                D="0"+D;
            }
            return WeekFirstDay.getFullYear()+"-"+M+"-"+D;
        },
        //本周最后一天
        showWeekLastDay:function (){
            let Nowdate=new Date();
            let WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
            let WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);
            let M=Number(WeekLastDay.getMonth())+1;
            if(M<10){
                M="0"+M;
            }
            let D=WeekLastDay.getDate();
            if(D<10){
                D="0"+D;
            }
            return WeekLastDay.getFullYear()+"-"+M+"-"+D;
        },
        //获得某月的天数：
        getMonthDays:function (myMonth){
        let monthStartDate = new Date(new Date().getFullYear(), myMonth, 1);
        let monthEndDate = new Date(new Date().getFullYear(), myMonth + 1, 1);
        let  days  =  (monthEndDate  -  monthStartDate)/(1000  *  60  *  60  *  24);
        return  days;
        },
        //点击事件
        query:function (way) {
            let self=this;
            this.$refs.pag.currentPage=1;
            this.page=this.$refs.pag.currentPage;
            switch (way){
                case 'today':
                this.startTime=this.maxTime;
                this.endTime=this.maxTime;
                break;
                case 'yesterday':
                this.startTime=this.Time(new Date().getTime()-24*60*60*1000);
                this.endTime=this.Time(new Date().getTime()-24*60*60*1000);
                break;
                case 'weeks':
                this.startTime=this.showWeekFirstDay();
                this.endTime=this.maxTime;
                break;
                case 'lastWeek':
                this.startTime=this.Time(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-new Date().getDay()-6));
                this.endTime=this.Time(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+(6-new Date().getDay()-6)));
                break;
                case 'month':
                this.startTime=this.Time(new Date(new Date().getFullYear(), new Date().getMonth(),1));
                this.endTime=this.maxTime;
                break;
                case 'lastMonth':
                this.startTime=this.Time(new Date(new Date().getFullYear(),new Date().getMonth()-1,1));
                this.endTime=this.Time(new Date(new Date().getFullYear(),new Date().getMonth()-1,this.getMonthDays(new Date().getMonth()-1)));
                break;
            }
            this.$axios({
                method:'post',
                url:'/inter/user/queryMemberReport',
                data:{
                    'account':this.account,
                    'baseLotteryId':this.lottersId,
                    'startTime':this.startTime,
                    'endTime':this.endTime
                }
            }).then(function (data) {
                //    console.log(data)
            }).catch(function (error) {
                console.log(error);
            })
        }
    }
}
</script>

<style>
</style>
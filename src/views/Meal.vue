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
                        <router-link to="/meal" class="active-menu"><i class="fa fa-desktop"></i>餐品维护表</router-link>
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
            <div id="page-inner">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tr>
                        <td align="center" class="biaoti" height="60">餐品维护表</td>
                    </tr>
                </table>
                <!-- <div align="right">
                    <button type="primary" v-on:click="exportExcel()">导出表格</button>
                </div> -->
                <div class="personalReport_time" align="left">
                    <input type="date" :max="this.endTime" value="" v-model="startTime"/>
                    <input type="date" :min="startTime" :max="this.maxTime" v-model="endTime"/>
                    <button @click="choose" class="but">查询</button>
                </div>
                <!-- <table class="personalReport_date">
                    <tr>
                        <td @click="query('today')">今天</td>
                        <td @click="query('yesterday')">昨天</td>
                        <td @click="query('weeks')">本周</td>
                        <td @click="query('lastWeek')">上周</td>
                        <td @click="query('month')">本月</td>
                        <td @click="query('lastMonth')">上月</td>
                    </tr>
                </table>
                <ul class="personalReport_date">
                    <li @click="query('today')">今天</li>
                    <li @click="query('yesterday')">昨天</li>
                    <li @click="query('weeks')">本周</li>
                    <li @click="query('lastWeek')">上周</li>
                    <li @click="query('month')">本月</li>
                    <li @click="query('lastMonth')">上月</li>
                </ul> -->
                <!-- <div>
                    <button @click="query" class="but">查询</button>
                </div> -->
                <table width="100%" border="2" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center" style="font-size:20px">
                    
                    <tr height="20">
                        <td colspan="1" width="5%" class="btbg font-center titfont" >日期</td>
                        <td colspan="1" width="5%" class="btbg font-center titfont" >餐品类别</td>
                        <td colspan="1" width="5%" class="btbg font-center titfont" >套餐类别</td>
                        <td colspan="6" width="10%" class="btbg font-center titfont" >餐品名称</td>
                        <td colspan="6" width="10%" class="btbg font-center titfont" >管理</td>
                    </tr>
                    
                    <template v-for="(day, i) in menuList">
                        <template v-for="(mealType, j) in day">
                            <template v-for="(course, k) in mealType">
                                <tr :key="`${i}-${j}-${k}`" height="20">
                                    <td width="5%" rowspan="6" class="btbg1 font-center" v-if="j === 0 && k === 0">{{dateList[i]}}</td>
                                    <td width="5%" rowspan="2" class="btbg2" v-if="k === 0">{{mealTypeList[j]}}</td>
                                    <td width="5%"  class="btbg2">{{courseTypeList[k]}}</td>
                                    <td v-for="n in 6" :key="n" 
                                        width="7%"  class="btbg2 dish-text-wrapper">
                                        <span v-if="textChanged(i, j, k, n-1)" style="color: red;">{{!oldMenuList[i][j][k].dishList[n-1] ? "（无）" : oldMenuList[i][j][k].dishList[n-1]}}</span>
                                        <input class="dish-input" type="text" v-model="course.dishList[n-1]" @blur="changeName(i, j, k, n-1)">
                                    </td>
                                    <td class="btbg2"><button type="primary" v-on:click="insert(i, j, k)" :disabled="disableInsert(i, j, k)">插入</button></td>
                                    <td class="btbg2"><button type="primary" v-on:click="update(i, j, k)" :disabled="disableUpdate(i, j, k)">修改</button></td>
                                </tr>
                            </template>
                        </template>
                    </template>
                </table>
            </div>

            <!-- /. PAGE INNER  -->
        <!-- /. PAGE WRAPPER  -->
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            startTime: "",
            endTime: "",
            maxTime: "",
            menuList: [],
            dateList: [],
            mealTypeList: ["早餐", "午餐", "晚餐"],
            courseTypeList: ["A", "B"],
            oldMenuList: [],
            food1: "无",
            id:""
        }
    },
    computed: {
        textChanged() {
            return (i, j, k, n) => {
                return this.menuList[i][j][k].dishList[n] !== this.oldMenuList[i][j][k].dishList[n]
            }
        },
        disableInsert() {
            return (i, j, k) => {
                if (this.menuList[i][j][k].id == null) {
                    if (this.menuList[i][j][k].dishList.some(dish => dish != "")) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            }
        },
        disableUpdate() {
            return (i, j, k) => {
                return this.menuList[i][j][k].id == null
            }
        }
    },
    methods:{
        getDateFormat(date) {
            const year = date.getFullYear()
            const month = `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`
            const day = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`

            let concat = "-"

            return `${year}${concat}${month}${concat}${day}`
        },
        choose() {
            console.log(this.startTime, this.endTime)
            const startDate = new Date(this.startTime)
            const endDate = new Date(this.endTime)

//             const weekday = selectedDay.getDay() == 0 ? 7 : selectedDay.getDay()
//             const hour = selectedDay.getHours()

//             const monday = new Date(selectedDay.getTime() + (1 - weekday) * 24 * 3600 * 1000)
//             const sunday = new Date(selectedDay.getTime() + (7 - weekday) * 24 * 3600 * 1000)
            const dateList = []
            for (let i = 0; i < 7; i++) {
                const monday = new Date(this.startTime)
                const thisday = new Date(monday.getTime() + i * 24 * 3600 * 1000)
                
                dateList.push(this.getDateFormat(thisday))
            }
            this.dateList = dateList

            const menuList = []
            for (let i = 0; i < 7; i++) {
                const menuTypeList = []
                for (let j = 0; j < 3; j++) {
                    const courseList = []
                    for (let k = 0; k < 2; k++) {
                        const dishList = []
                        for (let n = 0; n < 6; n++) {
                            dishList.push("")
                        }
                        courseList.push({
                            id: null,
                            dishList
                        })//push往数组里新增一个元素
                    }
                    menuTypeList.push(courseList)
                }
                menuList.push(menuTypeList)
            }

            const oldMenuList = JSON.parse(JSON.stringify(menuList))

            this.$api.get("/api/Food/ByEtime", { 
                    pageNum: 1,
                    pageSize: 50,
                    timeStart: this.startTime,
                    timeEnd: this.endTime
                })
                .then(res => {
                    console.log(res)
                    console.log(res.data.list)
                    
                    const courseList = res.data.list
                    // Arrange response data
                    courseList.forEach(course => {
                        const weekday = course.weekId
                        const mealType = Math.floor((course.typeId - 1) / 2) + 1
                        const courseIndex = (course.typeId - 1) % 2
                        
                        menuList[weekday - 1][mealType - 1][courseIndex].id = course.id
                        for (let key in course) {
                            const foodFieldMatch = key.match(/^food(\d+)$/i)
                            if (foodFieldMatch) {
                                menuList[weekday - 1][mealType - 1][courseIndex].dishList[parseInt(foodFieldMatch[1]) - 1] = course[key].trim().replace(/[\r\n]/g, "")
                            }
                        }
                    })
                    console.log(menuList)
                    this.menuList = menuList
                    this.oldMenuList = JSON.parse(JSON.stringify(menuList))
                })
                .catch(error => {
                    this.failure = true
                    console.log(error)
                })
        },
        update(i, j, k) {
            const params = {
                id: this.menuList[i][j][k].id
            }
            for (let n = 0; n < 6; n++) {
                if (this.menuList[i][j][k].dishList[n] !== this.oldMenuList[i][j][k].dishList[n]) {
                    params[`food${n + 1}`] = this.menuList[i][j][k].dishList[n]
                }
            }
            console.log(params)

            this.$api.get("/api/Food/Updata", params)
                .then(data => {
                    console.log(data)
                    if (data.result) {
                        this.$router.go(0)
                    }
                })
                .catch(error => {
                    this.failure = true
                    console.log(error)
                })
        },
        insert(i, j, k) {
            const params = {}
            for (let n = 0; n < 6; n++) {
                if (this.oldMenuList[i][j][k].dishList[n] == null) {
                    params[`food${n + 1}`] = this.menuList[i][j][k].dishList[n]
                }
            }
            console.log(params)
            this.$api.get("/api/Food/Insert", params)
                .then(data => {
                    console.log(data)
                    if (data.result) {
                        this.$router.go(0)
                    }
                })
                .catch(error => {
                    this.failure = true
                    console.log(error)
                })
            // console.log("insert", i, j, k)
            // this.$api.get("/api/Food/Insert", { food1, food2, food3, food4, food5, food6 })
            //     .then(data => {
            //         console.log(data)
                    
            //     })
            //     .catch(error => {
            //         this.failure = true
            //         console.log(error)
            //     })
        },
        changeName(i, j, k, n) {
            console.log(this.menuList[i][j][k].dishList[n])
            console.log(this.oldMenuList[i][j][k].dishList[n])
        },
        // // 导出表格
        // exportExcel() {
        // require.ensure([], () => {
        //     const { export_json_to_excel } = require("../excel/Export2Excel.js");

        //     const tHeader = ["部门", "餐别", "数量","是否领取"];// 上面设置Excel的表格第一行的标题
        //     const filterVal = ["id", "time", "img","hhh"]; // 上面的index、nickName、name是tableData里对象的属性
        
        //     const list = this.orderList;              //把data里的tableData存到list

        //     const data = this.formatJson(filterVal, list);
        
        //     export_json_to_excel(tHeader, data, "列表excel");   //标题，数据，文件名
        //     });
        // },

        // formatJson(filterVal, jsonData) {
        //     return jsonData.map(v => filterVal.map(j => v[j]));
        // },

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
.dish-text-wrapper {
    /* display: flex;
    flex-direction: column;
    align-items: center; */
}

.dish-text-wrapper span, .dish-text-wrapper input {
    display: block;
    width: 100%;
}

.dish-input {
    width: 150px;
}
</style>
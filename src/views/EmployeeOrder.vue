<template>
    <div id="wrapper">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
                <td align="center" class="biaoti" height="60">部门订餐历史统计表</td>
            </tr>
        </table>
        <div class="personalReport_time" align="left">
            <input type="date" :max="this.endTime" value="" v-model="startTime"/>
            <input type="date" :min="startTime" :max="this.maxTime" v-model="endTime"/>
            <button @click="query" class="but">查询</button>
        </div>
        <div align="right">
            <button type="primary" v-on:click="exportExcel()">导出表格</button>
        </div>
        <table width="30%" border="2" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center">
            <tr>
                <td width="10%" class="btbg font-center titfont" >姓名</td>
                <td width="10%" class="btbg font-center titfont" >金额</td>
                <td width="10%" class="btbg font-center titfont" >员工确认</td>
            </tr>
            <tr v-for="(order, index) in orderList" :key="index">
                <td>{{order.name}}</td>
                <td>{{order.num}}</td>
                <td width="10%">&nbsp;</td>
            </tr>
            <!-- <tr>
                <td width="10%" class="btbg2">111</td>
                <td width="10%" class="btbg2">111</td>
                <td width="10%" class="btbg2">111</td>
            </tr> -->
        </table>
    </div>
</template>

<script>
export default {
    data(){
        return{
            orderList:[
                {
                    name: "张三",
                    num: 20
                },
                {
                    name: "李四",
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

            const tHeader = ["部门", "餐别", "数量","是否领取"];// 上面设置Excel的表格第一行的标题
      
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
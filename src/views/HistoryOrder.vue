<template>
    <div class="history-order-page">
        <div class="personalReport_time" align="left">
            <input type="date" :max="endTime" value="" v-model="startTime"/>
            <input type="date" :min="startTime" :max="maxTime" v-model="endTime"/>
            <button class="but">查询</button>
            <!-- <button align="right" type="primary" v-on:click="exportExcel()">导出表格</button> -->
        </div>
        <div align="right">
            <button type="primary" v-on:click="exportExcel()">导出表格</button>
        </div>

        <b-card>
            <b-table-simple bordered>
                <b-thead>
                    <b-tr>
                        <b-th rowspan="3">日期</b-th>
                        <b-th rowspan="3">二级单位</b-th>
                        <b-th colspan="4">早餐</b-th>
                        <b-th colspan="4">午餐</b-th>
                        <b-th colspan="4">晚餐</b-th>
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2">A</b-th>
                        <b-th colspan="2">B</b-th>
                        <b-th colspan="2">A</b-th>
                        <b-th colspan="2">B</b-th>
                        <b-th colspan="2">A</b-th>
                        <b-th colspan="2">B</b-th>
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2">标准</b-th>
                        <b-th colspan="2">标准</b-th>
                        <b-th>小</b-th>
                        <b-th>大</b-th>
                        <b-th>小</b-th>
                        <b-th>大</b-th>
                        <b-th>小</b-th>
                        <b-th>大</b-th>
                        <b-th>小</b-th>
                        <b-th>大</b-th>
                    </b-tr>
                </b-thead>
            </b-table-simple>
        </b-card>

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
    }
}
</script>

<style lang="scss">
.history-order-page {
    .b-table {
        th, td {
            white-space: nowrap;
            vertical-align: middle;
            padding: 0.5rem;
        }
    }
}
</style>
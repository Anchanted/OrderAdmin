<template>
    <div class="daily-order-page">
        <table width="50%" border="2" cellspacing="0" cellpadding="0" align="center" style="font-size:20px">
            <tr>
                <td class="btbg font-center titfont">部门</td>
                <td class="btbg font-center titfont" colspan="2">{{currentStation}}</td>
            </tr>
            <tr>
                <td class="btbg2">餐别</td>
                <td class="btbg2">数量</td>
                <td class="btbg2">是否领取</td>
            </tr>
            <tr v-for="(order, index) in orderList" :key="index">
                <td>{{order.name}}</td>
                <td>{{order.total}}</td>
                <td>{{order.actual}}</td>
            </tr>
            <tr>
                <td>出单时间</td>
                <td colspan="2">数据库获取时间和数据</td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentStation: "公司办公室（党委办公室）",
            stationList: [
                "公司办公室（党委办公室）",
                "财务处",
                "勘探处"
            ],
            orderList: [
                {
                    name: "早餐A",
                    total: 30,
                    actual: 29
                },
                {
                    name: "早餐B",
                    total: 20,
                    actual: 20
                }
            ],
        startTime: "",
        endTime: "",
        maxTime: ""
        }
    },
    methods: {
        change() {

        },
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
        }
    }
}
</script>

<style>
</style>
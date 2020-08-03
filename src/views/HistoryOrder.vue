<template>
    <div class="history-order-page">
        <b-alert variant="danger" :show="!!errMsg">{{errMsg}}</b-alert>
        <div v-if="loading" class="loading-wrapper">
            <b-spinner style="width: 80px; height: 80px;" variant="secondary" label="Spinning"></b-spinner>
        </div>

        <b-form class="form" @submit.prevent="search">
            <b-form-group class="form-group" label="起始日期:" label-for="datepicker-start">
                <b-form-datepicker id="datepicker-start" class="mb-2" 
                    v-model="startDateStr" locale="zh" v-bind="labels" hide-header
                    :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }"
                    @input="chooseStartDate"></b-form-datepicker>
            </b-form-group>
            <b-form-group class="form-group" label="终止日期:" label-for="datepicker-end">
                <b-form-datepicker id="datepicker-end" class="mb-2" 
                    v-model="endDateStr" locale="zh" v-bind="labels" hide-header
                    :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }"
                    @input="chooseEndDate"></b-form-datepicker>
            </b-form-group>
            <b-form-group class="form-group" label="二级单位:" label-for="select-station">
                <b-form-select id="select-station" v-model="selectedStation" :options="options" @click.native="refreshStationList"></b-form-select>
            </b-form-group>
            <b-button type="submit" variant="secondary">查询</b-button>
        </b-form>

        <b-card>
            <b-table-simple bordered>
                <b-thead head-variant="light">
                    <b-tr>
                        <b-th rowspan="3">日期</b-th>
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
                <b-tbody>
                    <b-tr v-for="order in orderList" :key="order.date">
                        <b-td>{{order.date}}</b-td>
                        <template v-for="(mealType, i) in order.content">
                            <template v-for="(courseType, j) in mealType">
                                <template v-for="(size, k) in courseType">
                                    <b-td :key="`${i}|${j}|${k}`" :colspan="i === 0 ? 2 : 1"><span>{{size.count}}</span><span class="delimiter">/</span><span>{{size.price}}</span></b-td>
                                </template>
                            </template>
                        </template>
                    </b-tr>
                </b-tbody>
                <b-tfoot>
                    <b-tr>
                        <b-td>总计</b-td>
                        <template v-for="i in 3">
                            <template v-for="j in 2">
                                <template v-for="k in 2">
                                    <b-td v-if="!(i === 1 && k === 2)" :key="`${i}|${j}|${k}`" :colspan="i === 1 ? 2 : 1"><span>{{totalCount(i - 1, j - 1, k - 1)}}</span><span class="delimiter">/</span><span>{{totalPrice(i - 1, j - 1, k - 1)}}</span></b-td>
                                </template>
                            </template>
                        </template>
                    </b-tr>
                </b-tfoot>
            </b-table-simple>
        </b-card>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    data(){
        return{
            startDateStr: null,
            endDateStr: null,
            selectedStation: null,
            options: [
                { value: null, text: "--请选择一个二级单位--", disabled: true }
            ],
            orderList: [],
            loading: false,
            errMsg: ""
        }
    },
    computed: {
        ...mapState({
            apiStationList: state => state.apiStationList
        }),
        totalCount() {
            return (i, j, k) => {
                return !this.orderList.length ? "" : this.orderList.reduce((acc, order) => acc += order.content[i][j][k].count, 0)
            }
        },
        totalPrice() {
            return (i, j, k) => { 
                return !this.orderList.length ? "" : this.orderList.reduce((acc, order) => acc += order.content[i][j][k].price, 0)
            }
        },
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
        chooseStartDate() {
            if (new Date(this.endDateStr) < new Date(this.startDateStr)) this.endDateStr = this.startDateStr
        },
        chooseEndDate() {
            if (new Date(this.startDateStr) > new Date(this.endDateStr)) this.startDateStr = this.endDateStr
        },
        search() {
            if (!this.startDateStr) alert("请选择起始日期")
            else if (!this.endDateStr) alert("请选择终止日期")
            else if (!this.selectedStation) alert("请选择一个二级部门")
            else {
                this.errMsg = ""
                this.loading = true
                this.$api.get("/api/StationFoodData/ByHisdate", {
                        stationId: this.selectedStation.id,
                        timeStart: this.startDateStr,
                        timeEnd: this.endDateStr
                    })
                    .then(data => {
                        console.log(data)
                        const dateOrderList = data.data || []
                        this.orderList = dateOrderList.map(order => {
                            const contentList = []
                            for (let i = 0; i < 3; i++) {
                                const mealType = []
                                for (let j = 0; j < 2; j++) {
                                    const courseType = []
                                    for (let k = 0; k < 2; k++) {
                                        if (!(i === 0 && k === 1)) {
                                            courseType.push({
                                                count: 0,
                                                price: 0
                                            })
                                        }
                                    }
                                    mealType.push(courseType)
                                }
                                contentList.push(mealType)
                            }

                            for (let key in order) {
                                if (key.match(/^(morning|noon|night)([a-z])(max|min)?$/i)) {
                                    if (order[key]) {
                                        const mealType = RegExp.$1.toLowerCase() === "morning" ? 1 : (RegExp.$1.toLowerCase() === "noon" ? 2 : 3)
                                        const courseType = RegExp.$2.toUpperCase().charCodeAt() - 'A'.charCodeAt() + 1
                                        const size = !RegExp.$3 ? 0 : (RegExp.$3.toLowerCase() === "max" ? 0 : 1)
                                        contentList[mealType - 1][courseType - 1][size] = {
                                            count: order[key],
                                            price: order[`${key}Money`]
                                        }
                                    }
                                }
                            }

                            return {
                                date: new Date(order.dataTime).pattern("yyyy-MM-dd"),
                                content: contentList
                            }
                        })

                        this.orderList.sort((order1, order2) => new Date(order1.date) - new Date(order2.date))
                        this.loading = false
                    })
                    .catch(err => {
                        console.log(err)
                        this.errMsg = "数据加载失败，请重试"
                        this.loading = false
                    })
            }
        }
    },
    created() {
        const now = new Date()
        this.startDateStr = now.pattern("yyyy-MM-dd")
        this.endDateStr = now.pattern("yyyy-MM-dd")

        this.refreshStationList()
    }
}
</script>

<style lang="scss">
.history-order-page {
    .alert {
        margin: 20px 0 10px;
    }

    .loading-wrapper {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        opacity: 0.8;
        position: absolute;
        top: 0;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .form {
        width: 100%;
        padding: 20px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        >div:not(:last-child) {
            margin-right: 30px;
        }

        >div {
            margin-bottom: 0;
        }

        .form-group {
            display: flex;
            align-items: center;

            label {
                margin: 0;
                margin-right: 10px;
            }
        }

        .b-form-datepicker {
            width: 250px;
            margin: 0 !important;
        }
    }

    .b-table {
        margin: 0;

        th, td {
            white-space: nowrap;
            vertical-align: middle;
            padding: 0.5rem;
        }

        .delimiter {
            margin: 10px;
        }
    }
}
</style>
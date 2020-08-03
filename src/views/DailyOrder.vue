<template>
    <div class="daily-order-page">
        <b-alert variant="danger" :show="!!errMsg">{{errMsg}}</b-alert>
        <div v-if="loading" class="loading-wrapper">
            <b-spinner style="width: 80px; height: 80px;" variant="secondary" label="Spinning"></b-spinner>
        </div>

        <b-form class="form-wrapper" @submit.prevent="search">
            <b-form-group class="form-group" label="订单日期:" label-for="datepicker-order">
                <b-form-datepicker id="datepicker-order" class="mb-2" 
                    v-model="dateStr" locale="zh" v-bind="labels" hide-header
                    :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }"></b-form-datepicker>
            </b-form-group>
            <b-form-group class="form-group" label="二级单位:" label-for="select-station">
                <b-form-select id="select-station" v-model="selectedStation" :options="options" @click.native="refreshStationList"></b-form-select>
            </b-form-group>
            <b-button type="submit" variant="secondary">查询</b-button>
        </b-form>

        <b-card>
            <b-table-simple v-for="(order, index) in zoneList" :key="index" bordered>
                <b-thead head-variant="light">
                    <b-tr>
                        <b-th>日期</b-th>
                        <b-th colspan="2" width="70%">{{order.date}}</b-th>
                    </b-tr>
                    <b-tr>
                        <b-th>二级单位</b-th>
                        <b-th colspan="2" width="70%">{{`${order.stationName}${order.zone ? `（${order.zone}）` : ""}`}}</b-th>
                    </b-tr>
                    <b-tr>
                        <b-th>餐别</b-th>
                        <b-th>数量</b-th>
                        <b-th>是否领取</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <template v-for="(mealType, i) in order.content">
                        <template v-for="(courseType, j) in mealType">
                            <template v-for="(size, k) in courseType">
                                <b-tr :key="`${i}|${j}|${k}`">
                                    <b-td>{{courseName(i, j, k)}}</b-td>
                                    <b-td>{{size}}</b-td>
                                    <b-td></b-td>
                                </b-tr>
                            </template>
                        </template>
                    </template>

                </b-tbody>
                <b-tfoot>
                    <b-tr>
                        <b-td>出单时间</b-td>
                        <b-td colspan="2"></b-td>
                    </b-tr>
                </b-tfoot>
            </b-table-simple>
            <div v-if="!zoneList.length">未找到当日订单</div>
        </b-card>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    data() {
        return {
            dateStr: new Date().pattern("yyyy-MM-dd"),
            selectedStation: null,
            options: [
                { value: null, text: "--请选择一个二级单位--", disabled: true }
            ],
            zoneList: [],
            loading: false,
            errMsg: "",
        }
    },
    computed: {
        ...mapState({
            apiStationList: state => state.apiStationList
        }),
        courseName() {
            return (i, j, k) => {
                const mealTypeStr = i === 0 ? "早" : (i === 1 ? "午" : "晚")
                const courseStr = String.fromCharCode(j + 'A'.charCodeAt()) 
                const sizeStr = k ? "(小份)" : (i !== 0 ? "(大份)" : "")
                return `${mealTypeStr}餐${courseStr}${sizeStr}`
            }
        }
    },
    methods: {
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
        search() {
            if (!this.dateStr) alert("请选择订单日期")
            else if (!this.selectedStation) alert("请选择一个二级部门")
            else {
                this.errMsg = ""
                this.loading = true
                this.$api.get("api/StationFoodData/BySysdate", { 
                    stationId: this.selectedStation.id,
                    time: this.dateStr
                })
                .then(data => {
                    console.log(data)
                    const zoneList = data.data
                    this.zoneList = zoneList.map(order => {
                        const contentList = []
                        for (let i = 0; i < 3; i++) {
                            const mealType = []
                            for (let j = 0; j < 2; j++) {
                                const courseType = []
                                for (let k = 0; k < 2; k++) {
                                    if (!(i === 0 && k === 1)) {
                                        courseType.push(0)
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
                                    contentList[mealType - 1][courseType - 1][size] = order[key]
                                }
                            }
                        }

                        return {
                            date: new Date(order.dataTime).pattern("yyyy-MM-dd"),
                            stationId: order.stationId,
                            stationName: order.stationName,
                            zone: order.zone,
                            content: contentList
                        }
                    })
                    console.log(this.zoneList)
                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                    this.errMsg = "获取部门订单失败，请重试"
                    this.loading = false
                })
            }
        }
    },
    created() {
        this.refreshStationList()
    }
}
</script>

<style lang="scss">
.daily-order-page {
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

    .form-wrapper {
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
}
</style>
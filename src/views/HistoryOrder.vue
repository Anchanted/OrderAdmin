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

        <div class="file-button-wrapper">
            <b-button variant="primary" :disabled="!orderList.length" @click="exportExcel">导出为Excel表</b-button>
        </div>

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
                        <b-th>大</b-th>
                        <b-th>小</b-th>
                        <b-th>大</b-th>
                        <b-th>小</b-th>
                        <b-th>大</b-th>
                        <b-th>小</b-th>
                        <b-th>大</b-th>
                        <b-th>小</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr v-for="order in orderList" :key="order.date">
                        <b-td>{{order.date}}</b-td>
                        <template v-for="(mealType, i) in order.content">
                            <template v-for="(courseType, j) in mealType">
                                <template v-for="(size, k) in courseType">
                                    <b-td :key="`${i}|${j}|${k}`" :colspan="i === 0 ? 2 : 1"><span>{{size.count}}</span><span class="delimiter text-black-50">/</span><span>{{size.price}}</span></b-td>
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
                                    <b-td v-if="!(i === 1 && k === 2)" :key="`${i}|${j}|${k}`" :colspan="i === 1 ? 2 : 1"><span>{{totalCount(i - 1, j - 1, k - 1)}}</span><span class="delimiter text-black-50">/</span><span>{{totalPrice(i - 1, j - 1, k - 1)}}</span></b-td>
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
                this.$api.get("/StationFoodData/ByHisdate", {
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
        },
        // exportAsExcel() {
        //     const aoa = [
        //         ["日期", "早餐", null, null, null, "午餐", null, null, null, null, null, null, null, "晚餐", null, null, null, null, null, null, null],
        //         [null, "A", null, "B", null, "A", null, null, null, "B", null, null, null, "A", null, null, null, "B", null, null, null],
        //         [null, "标准", null, "标准", null, "大", null, "小", null, "大", null, "小", null, "大", null, "小", null, "大", null, "小", null],
        //     ]

        //     this.orderList.forEach(order => {
        //         const mealTypeList = order.content || []
        //         const subaoa = mealTypeList.flat(4).flatMap(course => [course.count, course.price])
        //         subaoa.unshift(order.date)
        //         aoa.push(subaoa)
        //     })

        //     const sheet = XLSX.utils.aoa_to_sheet(aoa)
        //     sheet['!merges'] = [
        //         {s: {r: 0, c: 0}, e: {r: 2, c: 0}},
        //         {s: {r: 0, c: 1}, e: {r: 0, c: 4}}, {s: {r: 0, c: 5}, e: {r: 0, c: 12}}, {s: {r: 0, c: 13}, e: {r: 0, c: 20}},
        //         {s: {r: 1, c: 1}, e: {r: 1, c: 2}}, {s: {r: 1, c: 3}, e: {r: 1, c: 4}}, {s: {r: 1, c: 5}, e: {r: 1, c: 8}}, {s: {r: 1, c: 9}, e: {r: 1, c: 12}}, {s: {r: 1, c: 13}, e: {r: 1, c: 16}}, {s: {r: 1, c: 17}, e: {r: 1, c: 20}},
        //         {s: {r: 2, c: 1}, e: {r: 2, c: 2}}, {s: {r: 2, c: 3}, e: {r: 2, c: 4}}, {s: {r: 2, c: 5}, e: {r: 2, c: 6}}, {s: {r: 2, c: 7}, e: {r: 2, c: 8}}, {s: {r: 2, c: 9}, e: {r: 2, c: 10}}, {s: {r: 2, c: 11}, e: {r: 2, c: 12}}, {s: {r: 2, c: 13}, e: {r: 2, c: 14}}, {s: {r: 2, c: 15}, e: {r: 2, c: 16}}, {s: {r: 2, c: 17}, e: {r: 2, c: 18}}, {s: {r: 2, c: 19}, e: {r: 2, c: 20}},
        //     ]
        //     FileSaver.saveAs(this.sheet2blob(sheet), `${this.selectedStation.stationName}历史订单（${this.startDateStr.replace(/\-/g, ".")} 至 ${this.endDateStr.replace(/\-/g, ".")}）.xlsx`)
        // },
        async exportExcel() {
            const workbook = new Excel.Workbook()
            const sheet = workbook.addWorksheet(this.selectedStation.stationName)

            const rows = [
                ["日期"],
                [null],
                [null],
                [null]
            ]
            const mergeList = ["A1:A4"]
            const borderColumnList = []
            const borderRowList = [5]

            const order = this.orderList[0]
            const mealTypeList = order.content || []

            const courseFieldArray = ["数量(份)", "价格(元)"]
            mealTypeList.forEach((courseTypeList, i) => {
                const mealTypeRowIndex = 0

                borderColumnList.push(rows[mealTypeRowIndex].length + 1)
                
                const mealTypCellName = `${i === 0 ? "早" : (i === 1 ? "午" : "晚")}餐`
                const mealTypeStartCol = String.fromCharCode(rows[mealTypeRowIndex].length + 'A'.charCodeAt())
                courseTypeList.flat(4).flatMap(course => courseFieldArray).forEach((cell, index) => rows[mealTypeRowIndex].push(!index ? mealTypCellName : null))
                const mealTypeEndCol = String.fromCharCode((rows[mealTypeRowIndex].length - 1) + 'A'.charCodeAt())
                mergeList.push(`${mealTypeStartCol}${mealTypeRowIndex + 1}:${mealTypeEndCol}${mealTypeRowIndex + 1}`)

                courseTypeList.forEach((sizeList, j) => {
                    const courseTypeRowIndex = mealTypeRowIndex + 1
                    const courseTypeCellName = String.fromCharCode(j + 'A'.charCodeAt()) 
                    const courseTypeStartCol = String.fromCharCode(rows[courseTypeRowIndex].length + 'A'.charCodeAt())
                    sizeList.flat(4).flatMap(course => courseFieldArray).forEach((cell, index) => rows[courseTypeRowIndex].push(!index ? courseTypeCellName : null))
                    const courseTypeEndCol = String.fromCharCode((rows[courseTypeRowIndex].length - 1) + 'A'.charCodeAt())
                    mergeList.push(`${courseTypeStartCol}${courseTypeRowIndex + 1}:${courseTypeEndCol}${courseTypeRowIndex + 1}`)

                    sizeList.forEach((course, k) => {
                        const sizeRowIndex = courseTypeRowIndex + 1
                        const sizeCellName = k ? "小" : (i !== 0 ? "大" : "标准")
                        const sizeStartCol = String.fromCharCode(rows[sizeRowIndex].length + 'A'.charCodeAt())
                        courseFieldArray.forEach((cell, index) => {
                            rows[sizeRowIndex].push(!index ? sizeCellName : null)
                            rows[sizeRowIndex + 1].push(cell)
                        })
                        const sizeEndCol = String.fromCharCode((rows[sizeRowIndex].length - 1) + 'A'.charCodeAt())
                        mergeList.push(`${sizeStartCol}${sizeRowIndex + 1}:${sizeEndCol}${sizeRowIndex + 1}`)
                    })
                })
            })

            sheet.addRows(rows)
            mergeList.forEach(merge => sheet.mergeCells(merge))
            sheet.getColumn(1).width = 12

            this.orderList.forEach(order => {
                const mealTypeList = order.content || []
                const subaoa = mealTypeList.flat(4).flatMap(course => [course.count, course.price])
                subaoa.unshift(order.date)
                sheet.addRow(subaoa)
            })

            sheet.eachRow((row, rowNumber) => {
                if (rowNumber <= 4) {
                    row.font = { bold: true }
                    row.alignment = { vertical: "middle", horizontal: "center" }
                }

                row.eachCell((cell, colNumber) => {
                    cell.border = {
                            ...cell.border,
                            top: { style: rowNumber === 1 ? "thick" : "thin" },
                            bottom: { style: rowNumber === sheet.rowCount ? "thick" : "thin" },
                            right: { style: colNumber === sheet.columnCount ? "thick" : "thin" },
                            left: { style: colNumber === 1 ? "thick" : "thin" },
                        }

                    if (borderRowList.includes(rowNumber)) {
                        cell.border = {
                            ...cell.border,
                            top: { style: "double" }
                        }
                    }

                    if (borderColumnList.includes(colNumber + 1)) {
                        cell.border = {
                            ...cell.border,
                            right: { style: "thick" }
                        }
                    }
                })
            })

            const buffer = await workbook.xlsx.writeBuffer()

            // const buffer = await workbook.xlsx.writeBuffer();
            // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            // const fileExtension = '.xlsx';
            // const blob = new Blob([buffer], {type: fileType});

            saveAs(new Blob([buffer]), `${this.selectedStation.stationName}历史订单（${this.startDateStr.replace(/-/g, ".")}-${this.endDateStr.replace(/-/g, ".")}）.xlsx`)
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
        z-index: 3;
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

    .file-button-wrapper {
        width: 100%;
        padding-bottom: 20px;
        display: flex;
        justify-content: flex-start;
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
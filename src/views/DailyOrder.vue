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

        <div class="file-button-wrapper">
            <b-button variant="primary" @click="exportExcel">导出所有部门订餐单据</b-button>
        </div>

        <b-card>
            <b-table-simple v-for="(order, index) in hallList" :key="index" bordered>
                <b-thead head-variant="light">
                    <b-tr>
                        <b-th>日期</b-th>
                        <b-th colspan="2" width="70%">{{order.date}}</b-th>
                    </b-tr>
                    <b-tr>
                        <b-th>二级单位</b-th>
                        <b-th colspan="2" width="70%">{{order.stationName}}{{order.hallId ? `（${order.hallName}）` : ""}}</b-th>
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
                                    <b-td>{{size.name}}</b-td>
                                    <b-td>{{size.count}}</b-td>
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
            <div v-if="!hallList.length">未找到当日订单</div>
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
            hallList: [],
            loading: false,
            errMsg: "",
        }
    },
    computed: {
        ...mapState({
            apiStationList: state => state.apiStationList
        })
    },
    methods: {
        search() {
            if (!this.dateStr) alert("请选择订单日期")
            else if (!this.selectedStation) alert("请选择一个二级部门")
            else {
                this.errMsg = ""
                this.loading = true
                this.$api.get("/StationFoodData/BySysdate", { 
                    stationId: this.selectedStation.id,
                    time: this.dateStr
                })
                .then(data => {
                    console.log(data)
                    this.hallList = this.rearrangeOrderList(data.data)
                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                    this.errMsg = "获取部门订单失败，请重试"
                    this.loading = false
                })
            }
        },
        async exportExcel() {
            let hallList
            this.errMsg = ""
            this.loading = true
            try {
                const data = await this.$api.get("/StationFoodData/BySysdate", { 
                    time: this.dateStr
                })
                hallList = data.data
                console.log(hallList)
                this.loading = false

                if (!hallList.length) {
                    alert(`没有${this.dateStr}的部门订单`)
                    return
                }
            } catch (error) {
                console.log(error)
                this.errMsg = "所有部门订餐数据获取失败，请重试"
                this.loading = false
            }

            if (!hallList) return

            hallList.sort((order1, order2) => {
                if (order1.stationId === order2.stationId) return (order1.hallId || 0) - (order2.hallId || 0)
                else return order1.stationId - order2.stationId
            })

            hallList = this.rearrangeOrderList(hallList)

            const nowStr = new Date().pattern("yyyy-MM-dd HH:mm:ss")
            const sheetList = ["早餐", "午餐", "晚餐"]
            const workbook = new Excel.Workbook()
            sheetList.forEach((sheetName, i) => {
                const sheet = workbook.addWorksheet(sheetName, { properties: { defaultColWidth: 15 } })

                hallList.forEach(order => {
                    const mealTypeList = order.content
                    const count = mealTypeList[i].flat(4).reduce((acc, course) => acc + course.count, 0)
                    if (!count) return

                    const startRowNum = sheet.rowCount + 2
                    const mergeList = []
                    mergeList.push(`A${sheet.rowCount + 1}:C${sheet.rowCount + 1}`)
                    mergeList.push(`B${sheet.rowCount + 2}:C${sheet.rowCount + 2}`)
                    mergeList.push(`B${sheet.rowCount + 3}:C${sheet.rowCount + 3}`)

                    sheet.addRow(["订餐单据", null, null])
                    sheet.addRow(["日期", order.date, null])
                    sheet.addRow(["二级单位", order.stationName + (order.hallId ? `（${order.hallName}）` : ""), null])
                    sheet.addRow(["餐别", "数量", "是否领取"])

                    mealTypeList[i].flat(4).forEach(course => sheet.addRow([course.name, course.count, ""]))

                    const endRowNum = sheet.rowCount + 1
                    mergeList.push(`B${sheet.rowCount + 1}:C${sheet.rowCount + 1}`)
                    sheet.addRow(["出单时间", nowStr, null])
                    sheet.addRow([])

                    mergeList.forEach(merge => sheet.mergeCells(merge))
                    sheet.getRow(startRowNum - 1).alignment = { horizontal: "center", vertical: "middle" }
                    for (let rowNumber = startRowNum; rowNumber <= endRowNum; rowNumber++) {
                        const row = sheet.getRow(rowNumber)
                        row.alignment = { horizontal: "center", vertical: "middle" }
                        row.eachCell((cell, colNumber) => {
                            cell.border = {
                                ...cell.border,
                                top: { style: rowNumber === startRowNum ? "thick" : "thin" },
                                bottom: { style: rowNumber === endRowNum ? "thick" :"thin" },
                                left: { style: colNumber === 1 ? "thick" : "thin" },
                                right: { style: colNumber === sheet.columnCount ? "thick" : "thin" }
                            }

                            if (rowNumber === endRowNum) {
                                cell.border = {
                                    ...cell.border,
                                    top: { style: "double" }
                                }
                            } else if (rowNumber === startRowNum + 2) {
                                cell.border = {
                                    ...cell.border,
                                    bottom: { style: "double" }
                                }
                            }
                        })
                    }
                })

                sheet.getColumn(2).width = 20
            })

            let mealTypeList = []
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
                mealTypeList.push(mealType)
            }

            mealTypeList = hallList.reduce((acc, order) => {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        for (let k = 0; k < 2; k++) {
                            if (!(i === 0 && k === 1)) {
                                acc[i][j][k] += order.content[i][j][k].count
                            }
                        }
                    }
                }
                return acc
            }, mealTypeList)

            const sheet = workbook.addWorksheet("数量总计", { properties: { defaultColWidth: 10 } })
            const rows = [
                ["日期"],
                [null],
                [null]
            ]
            const mergeList = ["A1:A3"]

            mealTypeList.forEach((courseTypeList, i) => {
                const mealTypeRowIndex = 0                
                const mealTypCellName = `${i === 0 ? "早" : (i === 1 ? "午" : "晚")}餐`
                const mealTypeStartCol = String.fromCharCode(rows[mealTypeRowIndex].length + 'A'.charCodeAt())
                courseTypeList.flat(4).forEach((cell, index) => rows[mealTypeRowIndex].push(!index ? mealTypCellName : null))
                const mealTypeEndCol = String.fromCharCode((rows[mealTypeRowIndex].length - 1) + 'A'.charCodeAt())
                mergeList.push(`${mealTypeStartCol}${mealTypeRowIndex + 1}:${mealTypeEndCol}${mealTypeRowIndex + 1}`)

                courseTypeList.forEach((sizeList, j) => {
                    const courseTypeRowIndex = mealTypeRowIndex + 1
                    const courseTypeCellName = String.fromCharCode(j + 'A'.charCodeAt()) 
                    const courseTypeStartCol = String.fromCharCode(rows[courseTypeRowIndex].length + 'A'.charCodeAt())
                    sizeList.flat(4).forEach((cell, index) => rows[courseTypeRowIndex].push(!index ? courseTypeCellName : null))
                    const courseTypeEndCol = String.fromCharCode((rows[courseTypeRowIndex].length - 1) + 'A'.charCodeAt())
                    if (courseTypeStartCol < courseTypeEndCol)
                        mergeList.push(`${courseTypeStartCol}${courseTypeRowIndex + 1}:${courseTypeEndCol}${courseTypeRowIndex + 1}`)

                    sizeList.forEach((course, k) => {
                        const sizeRowIndex = courseTypeRowIndex + 1
                        const sizeCellName = k ? "小" : (i !== 0 ? "大" : "标准")
                        rows[sizeRowIndex].push(sizeCellName)
                    })
                })
            })

            sheet.addRows(rows)
            sheet.addRow([this.dateStr, ...mealTypeList.flat(4)])

            mergeList.forEach(merge => sheet.mergeCells(merge))
            sheet.getColumn(1).width = 12
            sheet.eachRow((row, rowNumber) => {
                row.alignment = { horizontal: "center", vertical: "middle" }
                row.eachCell((cell, colNumber) => {
                    cell.border = {
                        ...cell.border,
                        top: { style: rowNumber === 1 ? "thick" : "thin" },
                        bottom: { style: rowNumber === sheet.rowCount ? "thick" : "thin" },
                        left: { style: colNumber === 1 ? "thick" : "thin" },
                        right: { style: colNumber === sheet.columnCount ? "thick" : "thin" }
                    }
                })
            })
            
            const buffer = await workbook.xlsx.writeBuffer()
            saveAs(new Blob([buffer]), `当日订单（${this.dateStr.replace(/-/g, ".")}）.xlsx`)
        },
        rearrangeOrderList(hallList) {
            return hallList.map(order => {
                const contentList = []
                for (let i = 0; i < 3; i++) {
                    const mealType = []
                    for (let j = 0; j < 2; j++) {
                        const courseType = []
                        for (let k = 0; k < 2; k++) {
                            if (!(i === 0 && k === 1)) {
                                const mealTypeStr = i === 0 ? "早" : (i === 1 ? "午" : "晚")
                                const courseStr = String.fromCharCode(j + 'A'.charCodeAt()) 
                                const sizeStr = k ? "(小份)" : (i !== 0 ? "(大份)" : "")
                                courseType.push({
                                    name: `${mealTypeStr}餐${courseStr}${sizeStr}`,
                                    count: 0
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
                            contentList[mealType - 1][courseType - 1][size].count = order[key]
                        }
                    }
                }

                return {
                    date: new Date(order.dataTime).pattern("yyyy-MM-dd"),
                    stationId: order.stationId,
                    stationName: order.stationName,
                    hallId: order.hallId,
                    hallName: order.hallName,
                    content: contentList
                }
            })
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
        z-index: 3;
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

    .file-button-wrapper {
        width: 100%;
        padding-bottom: 20px;
        display: flex;
        justify-content: flex-start;
    }
}
</style>
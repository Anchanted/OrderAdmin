<template>
    <div class="meal-page">
        <b-alert variant="danger" :show="!!errMsg">{{errMsg}}</b-alert>
        <div v-if="loading" class="loading-wrapper">
            <b-spinner style="width: 160px; height: 160px;" variant="secondary" label="Spinning" type="grow"></b-spinner>
        </div>
        
        <div class="datepicker-wrapper">
            <b-form-datepicker id="datepicker" class="mb-2" 
                v-model="selectedDateStr" locale="zh" v-bind="labels" hide-header
                :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }"
                @input="chooseDate"></b-form-datepicker>
        </div>

        <div class="file-input-wrapper">
            <b-form-file
                v-model="file"
                :state="Boolean(file)"
                accept=".xlsx"
                placeholder="请选择文件"
                no-drop
            ></b-form-file>
            <b-button variant="warning" :disabled="!Boolean(file)" @click="resetFile">撤销文件</b-button>
            <b-button variant="primary" :disabled="!Boolean(file)" @click="batchModify">批量更改菜品</b-button>
        </div>

        <div class="file-button-wrapper">
            <b-button variant="primary" :disabled="!menuList.length" @click="exportExcel">导出本周菜单为Excel文件</b-button>
        </div>

        <b-card>
            <b-table-simple bordered>
                <b-thead head-variant="light">
                    <b-tr>
                        <b-th rowspan="2">日期</b-th>
                        <b-th rowspan="2">餐品类别</b-th>
                        <b-th rowspan="2">套餐类别</b-th>
                        <b-th colspan="6">餐品名称</b-th>
                        <b-th rowspan="2">管理</b-th>
                    </b-tr>
                    <b-tr>
                        <b-th>1</b-th>
                        <b-th>2</b-th>
                        <b-th>3</b-th>
                        <b-th>4</b-th>
                        <b-th>5</b-th>
                        <b-th>6</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <template v-for="(day, i) in menuList">
                        <template v-for="(mealType, j) in day">
                            <template v-for="(course, k) in mealType">
                                <b-tr :key="`${i}-${j}-${k}`" height="20">
                                    <b-td rowspan="6" v-if="j === 0 && k === 0" v-html="new Date(dateList[i]).pattern('yyyy-MM-dd<br>EE')"></b-td>
                                    <b-td rowspan="2" v-if="k === 0">{{mealTypeList[j]}}</b-td>
                                    <b-td>{{courseTypeList[k]}}</b-td>
                                    <b-td v-for="n in 6" :key="n">
                                        <div v-if="textChanged(i, j, k, n-1)" style="color: red; margin-bottom: 10px; text-align: left;">{{!oldMenuList[i][j][k].dishList[n-1] ? "（无）" : oldMenuList[i][j][k].dishList[n-1]}}</div>
                                        <input style="width: 150px;" type="text" v-model="course.dishList[n-1]">
                                    </b-td>
                                    <b-td>
                                        <b-button-group>
                                            <b-button :disabled="disableInsert(i, j, k)" @click="insert(i, j, k)">添加</b-button>
                                            <b-button :disabled="disableUpdate(i, j, k)" @click="update(i, j, k)">修改</b-button>
                                        </b-button-group>
                                    </b-td>
                                </b-tr>
                            </template>
                        </template>
                    </template>
                </b-tbody>
            </b-table-simple>
        </b-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedDateStr: "",
            menuList: [],
            oldMenuList: [],
            dateList: [],
            mealTypeList: ["早餐", "午餐", "晚餐"],
            courseTypeList: ["A", "B"],
            loading: false,
            errMsg: "",
            file: null
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
                if (this.menuList[i][j][k].id == null)
                    return !this.menuList[i][j][k].dishList.some(dish => dish !== "")
                else
                    return true
            }
        },
        disableUpdate() {
            return (i, j, k) => {
                if (this.menuList[i][j][k].id != null) 
                    return !this.menuList[i][j][k].dishList.some((dish, index) => dish !== this.oldMenuList[i][j][k].dishList[index])
                else
                    return true
            }
        }
    },
    methods:{
        chooseDate() {
            const selectedDate = new Date(`${this.selectedDateStr} 00:00:00`)
            const selectedWeekday = selectedDate.getDay() == 0 ? 7 :selectedDate.getDay()
            const monday = new Date(selectedDate.getTime() + (1 - selectedWeekday) * 24 * 3600 * 1000)
            const sunday = new Date(selectedDate.getTime() + (7 - selectedWeekday) * 24 * 3600 * 1000)

            const dateList = []
            for (let i = 0; i < 7; i++) {
                const thisday = new Date(monday.getTime() + i * 24 * 3600 * 1000)
                dateList.push(thisday)
            }
            this.dateList = dateList

            const menuList = []
            for (let i = 0; i < 7; i++) {
                const menuTypeList = []
                for (let j = 0; j < 3; j++) {
                    const courseList = []
                    for (let k = 0; k < 2; k++) {
                        const dishList = []
                        courseList.push({
                            id: null,
                            dishList: new Array(6).fill("")
                        })
                    }
                    menuTypeList.push(courseList)
                }
                menuList.push(menuTypeList)
            }

            const oldMenuList = JSON.parse(JSON.stringify(menuList))

            this.errMsg = ""
            this.loading = true
            this.$api.get("/Food/ByEtime", { 
                    pageNum: 1,
                    pageSize: 50,
                    timeStart: monday.pattern("yyyy-MM-dd"),
                    timeEnd: sunday.pattern("yyyy-MM-dd")
                })
                .then(data => {
                    console.log(data)
                    const courseList = data.data.list
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
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.menuList = []
                    this.oldMenuList = []
                    this.errMsg = "菜单加载失败，请重试"
                    this.loading = false
                })
        },
        update(i, j, k) {
            const params = {
                id: this.menuList[i][j][k].id
            }
            for (let n = 0; n < 6; n++) {
                if (this.menuList[i][j][k].dishList[n] !== this.oldMenuList[i][j][k].dishList[n]) {
                    params[`food${n + 1}`] = (this.menuList[i][j][k].dishList[n] || "").trim().replace(/[\r\n]/g, "")
                }
            }
            console.log(params)
            this.errMsg = ""
            this.loading = true
            this.$api.get("/Food/Updata", params)
                .then(data => {
                    console.log(data)
                    if (data.data) {
                        this.chooseDate()
                    }
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.errMsg = `${this.dateList[i]}${this.mealTypeList[j]}${this.courseTypeList[k]}菜品修改失败，请重试`
                    this.loading = false
                })
        },
        insert(i, j, k) {
            const params = {
                typeId: j * 2 + k + 1,
                etime: this.dateList[i].pattern("yyyy-MM-dd HH:mm:ss")
            }
            for (let n = 0; n < 6; n++) {
                params[`food${n + 1}`] = (this.menuList[i][j][k].dishList[n] || "").trim().replace(/[\r\n]/g, "")
            }
            console.log(params)
            this.errMsg = ""
            this.loading = true
            this.$api.get("/Food/Insert", params)
                .then(data => {
                    console.log(data)
                    if (data.data) {
                        this.chooseDate()
                    }
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.errMsg = `${this.dateList[i].pattern("yyyy-MM-dd")}${this.mealTypeList[j]}${this.courseTypeList[k]}菜品添加失败，请重试`
                    this.loading = false
                })
        },
        async exportExcel() {
            const workbook = new Excel.Workbook()
            const sheet = workbook.addWorksheet("Sheet1", { properties: { defaultColWidth: 12, defaultRowHeight: 40 } })

            this.menuList.forEach((mealTypeList, n) => {
                const none = mealTypeList.flat(2).flatMap(course => course.dishList).every(dish => !dish)
                if (none) return

                const mergeList = []
                const startRowNumber = sheet.rowCount + 1
                mergeList.push(`A${sheet.rowCount + 1}:G${sheet.rowCount + 1}`)
                mergeList.push(`B${sheet.rowCount + 2}:D${sheet.rowCount + 2}`)
                mergeList.push(`E${sheet.rowCount + 2}:G${sheet.rowCount + 2}`)
                sheet.addRow([`${this.dateList[n].pattern("EE")}菜单`, null, null, null, null, null, null])
                sheet.addRow(["餐别", "套餐A", null, null, "套餐B", null, null])

                mealTypeList.forEach((courseTypeList, i) => {
                    mergeList.push(`A${sheet.rowCount + 1}:A${sheet.rowCount + 2}`)
                    sheet.addRows([
                        [this.mealTypeList[i], courseTypeList[0].dishList[0] || "", courseTypeList[0].dishList[1] || "", courseTypeList[0].dishList[2] || "", courseTypeList[1].dishList[0] || "", courseTypeList[1].dishList[1] || "", courseTypeList[1].dishList[2] || ""],
                        [null, courseTypeList[0].dishList[3] || "", courseTypeList[0].dishList[4] || "", courseTypeList[0].dishList[5] || "", courseTypeList[1].dishList[3] || "", courseTypeList[1].dishList[4] || "", courseTypeList[1].dishList[5] || ""]
                    ])
                })
                const endRowNumber = sheet.rowCount

                mergeList.forEach(merge => sheet.mergeCells(merge))

                const borderRowList = [4, 6, 8]
                const borderColumnList = [4, 7]

                for (let rowNumber = 1; rowNumber <= (endRowNumber - startRowNumber) + 1; rowNumber++) {
                    const row = sheet.getRow(startRowNumber + rowNumber - 1)
                    
                    row.font = { 
                        ...row.font,
                        name: "宋体", 
                        size: 11
                    }
                    row.alignment = { 
                        ...row.alignment,
                        vertical: "middle", 
                        horizontal: "center"
                    }

                    if (rowNumber === 1) 
                        row.font = {
                            ...row.font,
                            size: 14,
                            bold: true
                        }
                    row.eachCell((cell, colNumber) => {
                        if (rowNumber === 1) return

                        cell.border = {
                            ...cell.border,
                            top: { style: "thin" },
                            bottom: { style: "thin" },
                            left: { style: "thin" },
                            right: { style: "thin" }
                        }

                        if (borderRowList.includes(rowNumber))
                            cell.border = {
                                ...cell.border,
                                bottom: { style: "double" }
                            }

                        if (borderColumnList.includes(colNumber))
                            cell.border = {
                                ...cell.border,
                                right: { style: "thick" }
                            }

                        if (colNumber > 1) {
                            if (rowNumber === 2)
                                cell.font = {
                                    ...cell.font,
                                    bold: true
                                }
                            cell.alignment = {
                                ...cell.alignment,
                                wrapText: true,
                                shrinkToFit: true
                            }
                        } 
                    })
                }
            })

            sheet.getColumn(1).width = 7

            const buffer = await workbook.xlsx.writeBuffer()
            saveAs(new Blob([buffer]), `${this.dateList[0].pattern("yyyy.MM.dd")}-${this.dateList[this.dateList.length-1].pattern("yyyy.MM.dd")}菜单.xlsx`)
        },
        resetFile() {
            this.file = null
            this.menuList = JSON.parse(JSON.stringify(this.oldMenuList))
        },
        async batchModify() {
            try {
                const value = await this.$bvModal.msgBoxConfirm(`批量更改菜品将覆盖当前页面未提交的菜品修改，您确定继续此操作吗？`, {
                    title: "请确认",
                    size: "sm",
                    buttonSize: "sm",
                    okVariant: "danger",
                    okTitle: "确认",
                    cancelTitle: "取消",
                    footerClass: "p-2",
                    hideHeaderClose: false,
                    centered: true
                })
                
                if (!value) return
            } catch (error) {
                console.log(error)
            }

            const promises = []
            const promise = (url, params) => {
                return new Promise((resolve, reject) => {
                    this.$api.get(url, params).then(data => resolve(data)).catch(error => reject(error))
                })
            }
            
            this.errMsg = ""
            this.loading = true
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 3; j++) {
                    for (let k = 0; k < 2; k++) {
                        if (this.menuList[i][j][k].id == null) {
                            if (!this.menuList[i][j][k].dishList.some(dish => dish !== "")) continue
                            const params = {
                                typeId: j * 2 + k + 1,
                                etime: this.dateList[i].pattern("yyyy-MM-dd HH:mm:ss")
                            }
                            for (let n = 0; n < 6; n++) {
                                params[`food${n + 1}`] = (this.menuList[i][j][k].dishList[n] || "").trim().replace(/[\r\n]/g, "")
                            }
                            promises.push(promise("/Food/Insert", params))
                        } else {
                            if (!this.menuList[i][j][k].dishList.some((dish, index) => dish !== this.oldMenuList[i][j][k].dishList[index])) continue
                            const params = {
                                id: this.menuList[i][j][k].id
                            }
                            for (let n = 0; n < 6; n++) {
                                if (this.menuList[i][j][k].dishList[n] !== this.oldMenuList[i][j][k].dishList[n]) {
                                    params[`food${n + 1}`] = (this.menuList[i][j][k].dishList[n] || "").trim().replace(/[\r\n]/g, "")
                                }
                            }
                            promises.push(promise("/Food/Updata", params))
                        }
                    }
                }
            }

            Promise.allSettled(promises).then(results => {
                console.log(results)
            }).catch(error => {
                console.log(error)
                this.errMsg = "批量提交菜品出错，请重试"
            })
            this.loading = false
            this.chooseDate()
        }
    },
    created() {
        this.selectedDateStr = new Date().pattern("yyyy-MM-dd")
        this.chooseDate()
    },
    watch: {
        async file(val) {
            if (!val) return

            const parseFile = (file) => new Promise((resolve, reject) => {
                    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        reject({ msg: '仅支持Excel文件格式' });
                    }
                    const fileReader = new FileReader();
                    fileReader.onload = (e) => resolve(e.currentTarget.result);
                    fileReader.readAsBinaryString(file);
                })

            try {
                const data = await parseFile(val)
                const workbook = XLSX.read(data, {type: 'binary'})
                const sheet = workbook.Sheets[workbook.SheetNames[0]]

                const menuList = []
                for (let i = 0; i < 7; i++) {
                    const menuTypeList = []
                    for (let j = 0; j < 3; j++) {
                        const courseList = []
                        for (let k = 0; k < 2; k++) {
                            const dishList = []

                            const startRowNumber = i * 8 + 1
                            const endRowNumber = i * 8 + 8
                            for (let n = 0; n < 6; n++) {
                                const cellPos = `${String.fromCharCode(1 + k * 3 + n % 3 + 'A'.charCodeAt())}${startRowNumber + 2 + 2 * j + Math.floor(n / 3)}`
                                dishList.push(sheet[cellPos]?.v || "")
                            }

                            courseList.push({
                                id: this.menuList[i][j][k].id,
                                dishList
                            })
                        }
                        menuTypeList.push(courseList)
                    }
                    menuList.push(menuTypeList)
                }

                this.menuList = menuList
                console.log(this.menuList)
            } catch (error) {
                console.log(error)
            }
        }
    }
}

</script>

<style lang="scss">
.meal-page {
    width: 100%;
    position: relative;

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

    .datepicker-wrapper {
        width: 100%;
        padding: 20px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .b-form-datepicker {
            width: 250px;
            margin: 0 !important;
        }
    }

    .file-input-wrapper {
        width: 100%;
        padding-bottom: 20px;
        display: flex;
        align-items: center;

        .b-form-file {
            width: 400px;
            text-align: left;

            .custom-file-input ~ .custom-file-label::after {
                content: "上传Excel文件";
            }
        }

        button {
            margin-left: 20px;
        }
    }

    .file-button-wrapper {
        width: 100%;
        padding-bottom: 20px;
        display: flex;
        justify-content: flex-start;
    }

    .b-table {
        th, td {
            white-space: nowrap;
            vertical-align: middle;
            padding: 0.5rem;
        }
    }
}
</style>
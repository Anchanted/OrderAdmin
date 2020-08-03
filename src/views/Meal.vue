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
        chooseDate() {
            const selectedDate = new Date(`${this.selectedDateStr} 00:00:00`)
            const selectedWeekday =selectedDate.getDay() == 0 ? 7 :selectedDate.getDay()
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

            this.errMsg = ""
            this.loading = true
            this.$api.get("/api/Food/ByEtime", { 
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
            this.$api.get("/api/Food/Updata", params)
                .then(data => {
                    console.log(data)
                    if (data.result) {
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
            this.$api.get("/api/Food/Insert", params)
                .then(data => {
                    console.log(data)
                    if (data.result) {
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
    },
    mounted() {
        this.selectedDateStr = new Date().pattern("yyyy-MM-dd")
        this.chooseDate()
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
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .datepicker-wrapper {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;

        .b-form-datepicker {
            width: 250px;
            margin: 0 !important;
        }
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
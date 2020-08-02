<template>
    <div class="meal-page">
        <!-- <div align="right">
            <button type="primary" v-on:click="exportExcel()">导出表格</button>
        </div> -->
        <div class="datepicker-wrapper">
            <b-form-datepicker id="datepicker" class="mb-2" 
                v-model="selectedDateStr" locale="zh" v-bind="labels" hide-header start-weekday="1"
                :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }"
                @input="chooseDate"></b-form-datepicker>
        </div>

        <b-card>
            <b-table-simple bordered>
                <b-thead>
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
                                            <b-button @click="insert(i, j, k)" :disabled="disableInsert(i, j, k)">插入</b-button>
                                            <b-button @click="update(i, j, k)" :disabled="disableUpdate(i, j, k)">修改</b-button>
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
            maxTime: "",
            menuList: [],
            dateList: [],
            mealTypeList: ["早餐", "午餐", "晚餐"],
            courseTypeList: ["A", "B"],
            oldMenuList: [],
            labels: {
                weekdayHeaderFormat: 'narrow',
                labelPrevDecade: '过去十年',
                labelPrevYear: '上一年',
                labelPrevMonth: '上个月',
                labelCurrentMonth: '当前月份',
                labelNextMonth: '下个月',
                labelNextYear: '明年',
                labelNextDecade: '下一个十年',
                labelToday: '今天',
                labelSelected: '选定日期',
                labelNoDateSelected: '未选择日期',
                labelCalendar: '日历',
                labelNav: '日历导航',
                labelHelp: '使用光标键浏览日期'
            }
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
            console.log(this.selectedDateStr)
            const selectedDate = new Date(this.selectedDateStr)
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
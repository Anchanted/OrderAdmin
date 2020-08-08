<template>
    <div class="staff-order-page">
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
            <b-table-simple bordered hover>
                <b-thead head-variant="light">
                    <b-tr>
                        <b-th>姓名</b-th>
                        <b-th>金额</b-th>
                        <b-th>员工确认</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr v-for="staff in staffList" :key="staff.userId">
                        <b-td>{{staff.username}}</b-td>
                        <b-td>{{staff.ncountMoney}}</b-td>
                        <b-td></b-td>
                    </b-tr>
                </b-tbody>
                <b-tfoot>
                    <b-tr>
                        <b-td>总计</b-td>
                        <b-td>{{staffList.reduce((acc, staff) => acc += staff.ncountMoney, 0)}}</b-td>
                        <b-td></b-td>
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
        const now = new Date()
        return{
            startDateStr: now.pattern("yyyy-MM-dd"),
            endDateStr: now.pattern("yyyy-MM-dd"),
            selectedStation: null,
            options: [
                { value: null, text: "--请选择一个二级单位--", disabled: true }
            ],
            items: [],
            staffList: [],
            loading: false,
            errMsg: ""
        }
    },
    computed: {
        ...mapState({
            apiStationList: state => state.apiStationList
        })
    },
    methods:{
        chooseStartDate() {
            if (new Date(this.endDateStr) < new Date(this.startDateStr)) this.endDateStr = this.startDateStr
        },
        chooseEndDate() {
            if (new Date(this.startDateStr) > new Date(this.endDateStr)) this.startDateStr = this.endDateStr
        },
        search() {
            // console.log(this.startDateStr, this.endDateStr)
            // console.log(this.selectedStation)
            if (!this.startDateStr) alert("请选择起始日期")
            else if (!this.endDateStr) alert("请选择终止日期")
            else if (!this.selectedStation) alert("请选择一个二级部门")
            else {
                this.errMsg = ""
                this.loading = true
                this.$api.get("/FoodData/ByMoney", {
                        stationId: this.selectedStation.id,
                        timeStart: this.startDateStr,
                        timeEnd: this.endDateStr
                    })
                    .then(data => {
                        console.log(data)
                        this.staffList = data.data || []
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
        this.refreshStationList()
    }
}
</script>

<style lang="scss">
.staff-order-page {
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

    .b-table {
        margin: 0;

        th, td {
            white-space: nowrap;
            vertical-align: middle;
            padding: 0.5rem;
        }
    }
}
</style>
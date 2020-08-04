<template>
    <div class="user-page">
        <b-alert variant="danger" :show="!!errMsg">{{errMsg}}</b-alert>
        <div v-if="loading" class="loading-wrapper">
            <b-spinner style="width: 80px; height: 80px;" variant="secondary" label="Spinning"></b-spinner>
        </div>

        <div class="search-bar">
            <b-form-input type="search" v-model.trim="telephone" placeholder="请输入用户账号" @keyup.enter="search"></b-form-input>
            <b-button type="button" variant="secondary" @click="search">搜索</b-button>
        </div>

        <b-card>
            <b-table-simple v-if="userList.length" bordered striped="">
                <b-thead head-variant="light">
                    <b-tr>
                        <b-th>姓名</b-th>
                        <b-th>微信号（手机号）</b-th>
                        <b-th>密码</b-th>
                        <b-th>二级单位</b-th>
                        <b-th>三级单位</b-th>
                        <b-th>用户类型</b-th>
                        <b-th>操作</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <template v-for="(u, index) in userList" >
                        <b-tr :key="`${u.id}|0`">
                            <b-td :style="{ color: fieldModified(index, 1) ? 'red' : null }">{{u.username}}</b-td>
                            <b-td :style="{ color: fieldModified(index, 2) ? 'red' : null }">{{u.telephone}}</b-td>
                            <b-td style="color: red;">{{(u.password || "").replace(/./g, '*')}}</b-td>
                            <template v-if="u.roleId !== 1">
                                <b-td :style="{ color: fieldModified(index, 3) ? 'red' : null }">{{u.stationName}}</b-td>
                                <b-td :style="{ color: fieldModified(index, 4) ? 'red' : null }">{{u.wellName}}</b-td>
                                <b-td :style="{ color: fieldModified(index, 5) ? 'red' : null }">{{u.roleName}}</b-td>
                            </template>
                            <b-td v-else colspan="3">{{u.roleName}}</b-td>
                            <b-td></b-td>
                        </b-tr>
                        <b-tr :key="`${u.id}|1`">
                            <b-td><b-form-input v-model.trim="u.newUsername" placeholder="请输入姓名"></b-form-input></b-td>
                            <b-td><b-form-input v-model.trim="u.newTelephone" placeholder="请输入微信号（手机号）"></b-form-input></b-td>
                            <b-td><b-form-input v-model.trim="u.newPassword" placeholder="请输入密码" type="password"></b-form-input></b-td>
                            <template v-if="u.roleId !== 1">
                                <b-td><b-form-select v-model="u.newStationId" :options="u.stationOptions" value-field="stationId" text-field="stationName" @change="onChangeStation($event, index)"></b-form-select></b-td>
                                <b-td><b-form-select v-model="u.newWellId" :options="u.wellOptions" value-field="wellId" text-field="wellName"></b-form-select></b-td>
                                <b-td><b-form-select v-model="u.newRoleId" :options="u.roleOptions" value-field="roleId" text-field="roleName"></b-form-select></b-td>
                            </template>
                            <b-td v-else colspan="3">{{u.roleName}}</b-td>
                            <b-td><b-button variant="secondary" :disabled="user.roleId === u.roleId && user.id !== u.id" @click="update(index)">修改</b-button></b-td>
                        </b-tr>
                    </template>
                </b-tbody>
            </b-table-simple>
            <div v-else>未找到用户</div>
        </b-card>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    data() {
        return{
            telephone: "",
            userList: [],
            loading: false,
            errMsg: "",
            stationList: []
        }
    },
    computed: {
        ...mapState({
            user: state => state.user,
            apiStationList: state => state.apiStationList,
            apiWellList: state => state.apiWellList,
            apiRoleList: state => state.apiRoleList
        }),
        fieldModified() {
            return (userIndex, field) => {
                const user = this.userList[userIndex]
                switch (field) {
                    case 1:
                        return user.username !== user.newUsername
                    case 2:
                        return user.telephone !== user.newTelephone
                    case 3:
                        return user.stationId !== user.newStationId
                    case 4:
                        return user.wellId !== user.newWellId
                    case 5:
                        return user.roleId !== user.newRoleId
                }
            }
        }
    },
    methods:{
        search() {
            if (!this.telephone) alert("请输入用户账号")
            else {
                this.errMsg = ""
                this.loading = true
                this.$api.get("/ulogin/ByStationId", { 
                    telephone: this.telephone
                })
                .then(data => {
                    console.log(data)
                    this.userList = (data.data || []).map(user => {
                        return {
                            ...user,
                            newUsername: user.username,
                            newTelephone: user.telephone,
                            newPassword: user.password,
                            newStationId: user.stationId,
                            newWellId: user.wellId,
                            newRoleId: user.roleId,
                            stationOptions: this.stationList,
                            wellOptions: this.stationList.find(station => station.stationId === user.stationId)?.wellList,
                            roleOptions: this.apiRoleList.map(role => ({ ...role, disabled: role.roleId === 1 }))
                        }
                    })
                    console.log(this.userList)
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.errMsg = "获取用户信息失败，请重试"
                    this.loading = false
                })
            }
        },
        onChangeStation(value, index) {
            const station = this.stationList.find(station => station.stationId === value)
            if (station) {
                this.userList[index].wellOptions = station.wellList
                this.userList[index].newWellId = station.wellList?.[0].wellId
            }
        },
        async update(index) {
            const user = this.userList[index]

            if (this.user.roleId === user.roleId && this.user.id !== user.id) {
                alert("您没有修改该用户信息的权限")
                return
            }

            if (!user.newUsername) alert("请添加用户姓名")
            else if (!user.newTelephone) alert("请添加用户微信号（手机号）")
            else if (!user.newPassword) alert("请添加用户密码")
            else if (user.roleId !== 1 && !user.newPassword.match(/[0-9]{5}[0-9X]/g)) alert("重置用户密码格式错误（需为身份证后六位）")
            else {
                const params = {}
                if (user.newUsername !== user.username) params.username = user.newUsername
                if (user.newTelephone !== user.telephone) params.telephone = user.newTelephone
                if (user.newPassword !== user.password) params.password = user.newPassword
                if (user.roleId !== 1) {
                    if (user.newStationId !== user.stationId) params.stationId = user.newStationId
                    if (user.newWellId !== user.wellId) params.wellId = user.newWellId
                    if (user.newRoleId !== user.roleId) params.roleId = user.newRoleId
                }

                if (JSON.stringify(params) === "{}") alert("您对当前用户无任何修改操作")
                else {
                    params.id = user.id
                    console.log(params)

                    try {
                        this.errMsg = ""
                        this.loading = true

                        const data = await this.$api.get("/ulogin/Updata", params)
                        console.log(data)
                        this.loading = false

                        if (user.id === this.user.id) {
                            localStorage.removeItem("user")
                            this.$store.commit("setUser", null)
                            this.$router.push({
                                name: "Login"
                            })
                        } else {
                            this.search()
                        }
                    } catch (err) {
                        console.log(err)
                        this.errMsg = `用户${user.username}(${user.telephone})信息修改失败，请重试`
                        this.loading = false
                    }
                } 
            }
        }
    },
    created() {
        this.apiWellList.forEach(wellObj => {
            const stationObj = this.stationList.find(station => station.stationId === wellObj.stationId)
            if (!stationObj) {
                this.stationList.push({
                    stationId: wellObj.stationId,
                    stationName: wellObj.stationName,
                    wellList: [wellObj]
                })
            } else {
                stationObj.wellList.push(wellObj)
            }
        })
    }
}
</script>

<style lang="scss">
.user-page {
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

    .search-bar {
        padding: 20px 0;
        display: flex;
        justify-content: center;

        input {
            width: 350px;
            margin-right: 10px;
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
<template>
    <div class="user-page">
        <b-alert variant="danger" :show="!!errMsg">{{errMsg}}</b-alert>
        <div v-if="loading" class="loading-wrapper">
            <b-spinner style="width: 80px; height: 80px;" variant="secondary" label="Spinning"></b-spinner>
        </div>

        <b-card class="user-list-card">
            <caption>用户列表</caption>
            <b-table-simple small hover caption-top sticky-header>
                <b-thead head-variant="light">
                    <b-tr>
                        <b-th>序号</b-th>
                        <b-th>姓名</b-th>
                        <b-th>微信号（手机号）</b-th>
                        <b-th>二级单位</b-th>
                        <b-th>三级单位</b-th>
                        <b-th>用户类型</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr v-for="(user, index) in userList" :key="index" @click="onClickUserList($event, index)">
                        <b-td>{{index + 1}}</b-td>
                        <b-td>{{user.username}}</b-td>
                        <b-td>{{user.telephone}}</b-td>
                        <template v-if="user.roleId !== 1">
                            <b-td>{{user.stationName}}</b-td>
                            <b-td>{{user.wellName}}</b-td>
                            <b-td>{{user.roleName}}</b-td>
                        </template>
                        <b-td v-else colspan="3">{{user.roleName}}</b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
        </b-card>

        <b-card>
            <caption>修改用户</caption>

            <div class="search-bar">
                <b-form-input type="search" v-model.trim="telephone" placeholder="请输入用户微信号（手机号）" @keyup.enter="search"></b-form-input>
                <b-button type="button" variant="secondary" @click="search">搜索</b-button>
            </div>

            <b-table-simple v-if="modifiedUserList.length" bordered striped>
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
                    <template v-for="(u, index) in modifiedUserList" >
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
                            <b-td><b-form-input v-model.trim="u.newUsername" placeholder="请输入姓名" type="text"></b-form-input></b-td>
                            <b-td><b-form-input v-model.trim="u.newTelephone" placeholder="请输入微信号（手机号）" type="text"></b-form-input></b-td>
                            <b-td><b-form-input v-model.trim="u.newPassword" placeholder="请输入密码" type="password"></b-form-input></b-td>
                            <template v-if="u.roleId !== 1">
                                <b-td><b-form-select v-model="u.newStationId" :options="stationOptions" value-field="stationId" text-field="stationName" @change="onChangeStation($event, index)"></b-form-select></b-td>
                                <b-td><b-form-select v-model="u.newWellId" :options="wellOptions(u.newStationId)" value-field="wellId" text-field="wellName"></b-form-select></b-td>
                                <b-td><b-form-select v-model="u.newRoleId" :options="roleOptions" value-field="roleId" text-field="roleName"></b-form-select></b-td>
                            </template>
                            <b-td v-else colspan="3">{{u.roleName}}</b-td>
                            <b-td>
                                <b-button-group>
                                    <b-button variant="primary" :disabled="updateDisabled(index)" @click="updateUser(index)">更新</b-button>
                                    <b-button variant="danger" :disabled="user.roleId === u.roleId" @click="deleteUser(index)">删除</b-button>
                                </b-button-group>
                            </b-td>
                        </b-tr>
                    </template>
                </b-tbody>
            </b-table-simple>
            <div v-else style="padding: 10px 0;">未找到用户</div>
        </b-card>

        <b-card>
            <caption>添加用户</caption>
            <b-table-simple bordered>
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
                    <b-tr>
                        <b-td><b-form-input v-model.trim="newUser.username" placeholder="请输入姓名" type="text"></b-form-input></b-td>
                        <b-td><b-form-input v-model.trim="newUser.telephone" placeholder="请输入微信号（手机号）" type="text"></b-form-input></b-td>
                        <b-td><b-form-input v-model.trim="newUser.password" placeholder="请输入密码" type="password"></b-form-input></b-td>
                        <template v-if="newUser.roleId !== 1">
                            <b-td><b-form-select v-model="newUser.stationId" :options="stationOptions" value-field="stationId" text-field="stationName" @change="onChangeStation"></b-form-select></b-td>
                            <b-td><b-form-select v-model="newUser.wellId" :options="wellOptions(newUser.stationId)" value-field="wellId" text-field="wellName"></b-form-select></b-td>
                            <b-td><b-form-select v-model="newUser.roleId" :options="roleOptions" value-field="roleId" text-field="roleName"></b-form-select></b-td>
                        </template>
                        <b-td v-else colspan="3">{{u.roleName}}</b-td>
                        <b-td>
                            <b-button variant="success" :disabled="insertDisabled" @click="insertUser">添加</b-button>
                        </b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
        </b-card>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    data() {
        return{
            telephone: "",
            modifiedUserList: [],
            loading: false,
            errMsg: "",
            stationList: [],
            userList: [],
            newUser: {
                username: "",
                password: "",
                telephone: "",
                stationId: null,
                wellId: null,
                roleId: null
            }
        }
    },
    computed: {
        ...mapState({
            user: state => state.user,
            apiStationList: state => state.apiStationList,
            apiWellList: state => state.apiWellList,
            apiRoleList: state => state.apiRoleList
        }),
        stationOptions() {
            return [
                { stationId: null, stationName: "--请选择二级单位--", disabled: true },
                ...this.stationList.map(station => ({ stationId: station.stationId, stationName: station.stationName }))
            ]
        },
        wellOptions() {
            return (stationId) => {
                const station = this.stationList.find(station => station.stationId === stationId)
                return [
                    { wellId: null, wellName: "--请选择三级单位--", disabled: true },
                    ...(station ? station.wellList : [])
                ]
            }
        },
        roleOptions() {
            return [
                { roleId: null, roleName: "--请选择用户类型--", disabled: true },
                ...this.apiRoleList.map(role => ({ ...role, roleId: role.id, disabled: role.id === 1 }))
            ]
        },
        fieldModified() {
            return (userIndex, field) => {
                const user = this.modifiedUserList[userIndex]
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
        },
        updateDisabled() {
            return (index) => {
                const user = this.modifiedUserList[index]
                if (this.user.roleId === user.roleId && this.user.id !== user.id) return true
                else return !user.newUsername || !user.newTelephone || !user.newPassword || (user.roleId === 1 ? false : (!user.newStationId || !user.newWellId || !user.newRoleId))
            }
        },
        insertDisabled() {
            return !(this.newUser.username && this.newUser.password && this.newUser.telephone && (this.newUser.roleId === 1 ? true : (this.newUser.stationId && this.newUser.wellId && this.newUser.roleId)))
        }
    },
    methods:{
        getUserList() {
            return new Promise((resolve, reject) => {
                this.errMsg = ""
                this.loading = true

                this.$api.get("/ulogin/ByStationId")
                    .then(data => {
                        console.log(data)
                        this.userList = data.data || []
                        this.loading = false
                        resolve(data)
                    })
                    .catch(error => {
                        console.log(error)
                        this.errMsg = "获取用户列表失败，请重试"
                        this.loading = false
                        reject(error)
                    })
            })
        },
        getModifiedUserList(userList) {
            this.modifiedUserList = userList.map(user => {
                return {
                    ...user,
                    newUsername: user.username,
                    newTelephone: user.telephone,
                    newPassword: user.password,
                    newStationId: user.stationId,
                    newWellId: user.wellId,
                    newRoleId: user.roleId
                }
            })
        },  
        search() {
            if (!this.telephone) 
                alert("请输入用户微信号（手机号）")
            else 
                this.getModifiedUserList(this.userList.filter(user => user.telephone === this.telephone))
        },
        onClickUserList(e, index) {
            this.getModifiedUserList([this.userList[index]])
        },
        onChangeStation(value, index) {
            const station = this.stationList.find(station => station.stationId === value)
            if (station) {
                if (index != null) this.modifiedUserList[index].newWellId = null
                else this.newUser.wellId = null
            }
        },
        async updateUser(index) {
            const user = this.modifiedUserList[index]
            if (user.roleId !== 1 && !user.newPassword.match(/^[0-9]{5}[0-9X]$/g)) {
                alert("重置用户密码格式错误（需为身份证后六位）")
                return
            }
            const params = {}
            if (user.newUsername !== user.username) params.username = user.newUsername
            if (user.newTelephone !== user.telephone) params.telephone = user.newTelephone
            if (user.newPassword !== user.password) params.password = user.newPassword
            if (user.newRoleId !== user.roleId) params.roleId = user.newRoleId
            if (user.newRoleId !== 1) {
                if (user.newStationId !== user.stationId) params.stationId = user.newStationId
                if (user.newWellId !== user.wellId) params.wellId = user.newWellId
            }

            if (JSON.stringify(params) === "{}") {
                alert("您对当前用户无任何修改操作")
                return
            }
            params.id = user.id

            this.errMsg = ""
            this.loading = true
            try {
                const data = await this.$api.get("/ulogin/Updata", params)
                console.log(data)
                this.loading = false

                if (!data.data) throw new Error(data.msg)

                if (user.id === this.user.id) {
                    localStorage.removeItem("user")
                    this.$store.commit("setUser", null)
                    this.$router.push({
                        name: "Login"
                    })
                } else {
                    await this.getUserList()
                    this.getModifiedUserList(this.userList.filter(u => u.id === user.id))
                }
            } catch (error) {
                console.log(error)
                this.errMsg = `更新用户${user.username}(${user.telephone})信息失败，请重试`
                this.loading = false
            }
        },
        async deleteUser(index) {
            const user = this.modifiedUserList[index]
            if (user.roleId === 1) {
                alert("您没有权限删除当前用户")
                return
            }

            try {
                const value = await this.$bvModal.msgBoxConfirm(`删除用户后将无法恢复该用户的信息，您确认删除用户${user.username}(${user.telephone})吗？`, {
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
            
            this.errMsg = ""
            this.loading = true
            try {
                const data = await this.$api.get("/ulogin/Delete", {
                    id: user.id
                })
                console.log(data)
                this.loading = false

                if (!data.data) throw new Error(data.msg)

                await this.getUserList()
                this.modifiedUserList = []
            } catch (error) {
                console.log(error)
                this.errMsg = `删除用户${user.username}(${user.telephone})信息失败，请重试`
                this.loading = false
            }
        },
        async insertUser() {
            if (this.insertDisabled) {
                alert("请补全添加用户信息")
                return
            }

            const user = this.userList.find(user => user.roleId !== 1 && (user.username === this.newUser.username || user.telephone === this.newUser.telephone))
            if (user) {
                try {
                    const value = await this.$bvModal.msgBoxConfirm(`已存在用户${user.username}(${user.telephone})，确认添加新用户吗？`, {
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
            }

            const params = {}
            params.username = this.newUser.username
            params.telephone = this.newUser.telephone
            params.password = this.newUser.password
            params.roleId = this.newUser.roleId
            if (this.newUser.roleId !== 1) {
                params.wellId = this.newUser.wellId
            }

            this.errMsg = ""
            this.loading = true
            try {
                const data = await this.$api.get("/ulogin/Insert", params)
                console.log(data)
                this.loading = false

                if (!data.data) throw new Error(data.msg)

                await this.getUserList()
                this.getModifiedUserList([this.userList[this.userList.length-1]])
                this.newUser = {
                    username: "",
                    password: "",
                    telephone: "",
                    stationId: null,
                    wellId: null,
                    roleId: null
                }
            } catch (error) {
                console.log(error)
                this.errMsg = `添加用户失败，请重试`
                this.loading = false
            }
        },
        refreshUserStationList() {
            if (this.options.length <= 1) {
                this.apiStationList.forEach(station => {
                    this.options.push({
                        value: JSON.parse(JSON.stringify(station)),
                        text: station.stationName
                    })
                })
            }
        }
    },
    created() {
        this.getUserList()
    },
    watch: {
        apiWellList: {
            deep: true,
            immediate: true,
            handler: function(val) {
                if (val.length) {
                    if (!this.stationList.length) {
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
            }
        }
    }
}
</script>

<style lang="scss">
.user-page {
    padding-bottom: 400px;

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

    .card {
        margin: 20px 0;
        caption {
            width: 100px; 
            font-weight: bold; 
            padding-top: 0;
        }
    }

    .user-list-card {
        .b-table {
            tbody {
                tr {
                    cursor: pointer;
                }
            }
        }
    }

    .search-bar {
        margin-bottom: 20px;
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
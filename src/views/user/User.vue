<template>
    <div id="wrapper">
        <form>
            <table align="center" valign="center" width="70%" border="0">
                <tr class="biaoti" style="width: 100%;height: 40px;font-size: 40px;">查询修改用户信息</tr>
                <tr>
                    <td align="center">
                        <input type="text" name="telephone" placeholder="请输入账号查询用户" style="width: 100%; height: 40px; font-size: 20px;"
                        v-model="telephone">
                    </td>
                    <td align="right" width="5%">
                        <button type="primary" v-on:click.prevent="search()">查询</button>
                    </td>
                </tr>
            </table>
            <table width="100%" border="2" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center">
                <tr>
                    <td width="5%" class="btbg font-center titfont" >序号</td>
                    <td width="7%" class="btbg font-center titfont" >姓名</td>
                    <td width="10%" class="btbg font-center titfont" >手机号</td>
                    <td width="10%" class="btbg font-center titfont" >密码</td>
                    <td width="10%" class="btbg font-center titfont" >公司级单位</td>
                    <td width="13%" class="btbg font-center titfont" >二级单位</td>
                    <td width="13%" class="btbg font-center titfont" >三级单位</td>
                    <td width="10%" class="btbg font-center titfont" >用户级别</td>
                    <td width="10%" class="btbg font-center titfont" >是否查看部门历史订单</td>
                    <td width="5%" class="btbg font-center titfont" >是否修改</td>
                </tr>
                <tr>
                    <td width="5%" class="btbg2">{{user.id}}</td>
                    <td width="7%" class="btbg2">{{user.username}}</td>
                    <td width="10%" class="btbg2">{{user.telephone}}</td>
                    <td width="10%" class="btbg2">{{user.password}}</td>
                    <td width="10%" class="btbg2">{{user.areaName}}</td>
                    <td width="13%" class="btbg2">{{user.stationName}}</td>
                    <td width="13%" class="btbg2">{{user.wellName}}</td>
                    <td width="10%" class="btbg2">{{user.roleName}}</td>
                    <td width="10%" class="btbg2"><input type="radio" name="judge" value="Y">Yes<input type="radio" name="judge" value="N">No</td>
                    <td width="5%" class="btbg2">
                        <button type="primary" v-on:click="changeUser">修改</button>
                    </td>
                </tr>
            </table>

            <!-- <table width="100%" border="2" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center">
                <tr>
                    <td width="10%" class="btbg font-center titfont" >序号</td>
                    <td width="10%" class="btbg font-center titfont" >姓名</td>
                    <td width="10%" class="btbg font-center titfont" >手机号</td>
                    <td width="10%" class="btbg font-center titfont" >密码</td>
                    <td width="10%" class="btbg font-center titfont" >公司级单位</td>
                    <td width="10%" class="btbg font-center titfont" >二级单位</td>
                    <td width="10%" class="btbg font-center titfont" >三级单位</td>
                    <td width="10%" class="btbg font-center titfont" >用户级别</td>
                    <td width="10%" class="btbg font-center titfont" >是否查看部门历史订单</td>
                </tr>
                <tr>
                    <td width="10%" class="btbg2">{{user.id}}</td>
                    <td width="10%" class="btbg2">{{user.username}}</td>
                    <td width="10%" class="btbg2">{{user.telephone}}</td>
                    <td width="10%" class="btbg2">{{user.password}}</td>
                    <td width="10%" class="btbg2">{{user.areaName}}</td>
                    <td width="10%" class="btbg2">{{user.stationName}}</td>
                    <td width="10%" class="btbg2">{{user.wellName}}</td>
                    <td width="10%" class="btbg2">{{user.roleName}}</td>
                    <td width="10%" class="btbg2"><input type="radio" name="judge" value="Y">Yes<input type="radio" name="judge" value="N">No</td>
                </tr>
            </table> -->
            <div>
                <button type="primary" v-on:click="cancel">取消</button>
                <button type="primary" v-on:click="save">保存</button>
            </div>
        </form>
        <div v-if="failure" style="color: red;">无此账号，请重新输入</div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            user: {
                areaId: 2,
                areaName: "华北油田公司",
                id: 1,
                mark: 0,
                password: "010337",
                roleId: 3,
                roleName: "一般用户",
                stationId: 1,
                stationName: "公司办公室（党委办公室）",
                stime: "2020-07-18 16:12:12",
                telephone: "13833759376",
                username: "王海涛",
                wellId: 1,
                wellName: "处领导"
            },
            failure: false,
            telephone: ""
        }
    },
    methods:{
        search() {
            this.$api.post("/api/ulogin", { 
                telephone: "138337596", 
                password: "010337" 
            })
            .then(data => {
                console.log(data)
                console.log("跳转页面")
                // this.$router.push({
                //     name: "Meal"
                // })
            })
            .catch(error => {
                this.failure = true
                console.log(error)
            })
        },
        changeUser() {
            this.$api.put("/api/ulogin", { 
                telephone: "13833759376", 
                password: "010337" 
            })
        },
        cancel() {
            
        },
        save() {
            this.$api.put("/api/ulogin", { 
                telephone: "13833759376", 
                password: "010337" 
            })
        }
    }
}
</script>

<style>
</style>
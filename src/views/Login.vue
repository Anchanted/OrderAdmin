<template>
    <div class="login-page">
        <div class="login-title">移动点餐后台管理平台</div>
        <b-card class="form-wrapper">
            <div v-if="failure" style="color: red;">用户名或密码错误</div>
            <b-form @submit.prevent="onSubmit">
                <b-form-group id="input-group-1" label="用户名：" label-for="input-1" label-cols="2" label-align="right">
                    <b-form-input
                        id="input-1"
                        v-model.trim="username"
                        type="text"
                        required
                        placeholder="请输入用户名"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="密码：" label-for="input-2" label-cols="2" label-align="right">
                    <b-form-input
                        id="input-2"
                        v-model.trim="password"
                        type="password"
                        required
                        placeholder="请输入密码"
                    ></b-form-input>
                </b-form-group>

                <b-button type="submit" variant="primary">提交</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            username: "",
            password: "",
            failure: false
        }
    },
    computed: {
        ...mapState({
            user: state => state.user
        })
    },
    methods: {
        onSubmit(e) {
            this.$api.post("/api/ulogin", { telephone: this.username, password: this.password })
                .then(data => {
                    console.log(data)
                    const user = data.data
                    if (user.roleId !== 1) this.failure = true
                    else {
                        const expireDate = new Date(new Date().getTime() + 1 * 60 * 60 * 1000).pattern("yyyy-MM-dd HH:mm:ss")
                        localStorage.setItem("user", JSON.stringify({
                            ...user,
                            expireDate
                        }))
                        this.$store.commit("setUser", {
                            ...user,
                            expireDate
                        })
                        this.$router.push({
                            path: "/"
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.failure = true
                })
        }
    }
}
</script>

<style lang="scss">
.login-page {
    width: 100%;
    height: 100%;
    background-color: #fafbfe;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .login-title {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .form-wrapper {
        width: 500px;
        margin-bottom: 100px;
    }
}
</style>
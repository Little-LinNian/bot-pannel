<template>
<div class="container">
    请输入Token
    <input type="text" v-model="token" placeholder="请输入Token" />
    <button @click="login">登录</button>
</div>
</template>

</template>

<script>
const token = require('../../config/token')
export default {
    data () {
        return {
            token: ''
        }
    },
    methods: {
        login () {
            localStorage.setItem('token', this.token)
            location.href = '/#/dashboard'
        }
    }

            
}
</script>

<style>

</style>
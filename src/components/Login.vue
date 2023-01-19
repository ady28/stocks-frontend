<template>
    <div>
        <form>
            <div class="form-outline mb-4">
                <input v-model="email" type="email" id="inputEmail" class="form-control" placeholder="Email address" />
            </div>
            <div class="form-outline mb-4">
                <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password">
            </div>
            <button v-on:click="doLogin" type="button" class="btn btn-primary btn-block mb-4" v-bind:disabled="loginButtonDisable">Login</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'DoLogin',
        data: function() {
            return {
                loginButtonDisable: true,
                email: "",
                password: ""
            }
        },
        watch: {
            email: function() {
                if(this.email === "" || this.password === "") {
                    this.loginButtonDisable = true
                } else if (this.email.length > 0 && this.password.length > 0) {
                    this.loginButtonDisable = false
                }
            },
            password: function() {
                if(this.email === "" || this.password === "") {
                    this.loginButtonDisable = true
                } else if (this.email.length > 0 && this.password.length > 0) {
                    this.loginButtonDisable = false
                }
            }
        },
        methods: {
            doLogin: async function() {
                const tempEmail = this.email
                this.email = ''
                const tempPassword = this.password
                this.password = ''

                await axios.post(`${process.env.VUE_APP_STOCKSCLIENTAPI2}/auth/login`, {email: tempEmail, password: tempPassword}, {withCredentials: true})
                .then(response => (this.resp = response))
                .catch(function(error){this.$toast.error(error)});

                if(this.resp.success === false)
                {
                    this.$toast.error(this.resp.data, {
                    dismissible: true
                    });
                }
                else
                {
                    this.$store.commit('SET_USER', this.resp.data)
                    this.$router.push({name: 'home'})
                    this.$toast.success("Logged in", {
                    dismissible: true
                    });
                }
            }
        }
    }
</script>
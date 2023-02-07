<template>
    <div class="py-2">
        <h4>Update API keys</h4>
        <form class="row gy-2 gx-3 align-items-center">
            <div class="col-auto">
                <label for="inputYahooKey">Yahoo API Key:</label>
            </div>
            <div class="col-auto">
                <input v-model="ykey" type="password" class="form-control" id="inputYahooKey">
            </div>
            <div class="col-auto">
                <button v-on:click="updateYKey" v-bind:disabled="yKeyButtonDisabled" type="button" class="btn btn-success">Update</button>
            </div>
        </form>
        <form class="row py-2 gy-2 gx-3 align-items-center">
            <div class="col-auto">
                <label for="inputAlphaKey">Alpha API Key:</label>
            </div>
            <div class="col-auto">
                <input v-model="akey" type="password" class="form-control" id="inputAlphaKey">
            </div>
            <div class="col-auto">
                <button v-on:click="updateAKey" v-bind:disabled="aKeyButtonDisabled" type="button" class="btn btn-success">Update</button>
            </div>
        </form>      
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'SettingsPage',
        data() {
        return {
                ykey: "",
                akey: "",
                yKeyButtonDisabled: true,
                aKeyButtonDisabled: true,
                resp: {}
            }
        },
        watch: {
                ykey: function() {
                if(this.ykey === "") {
                    this.yKeyButtonDisabled = true
                } else {
                    this.yKeyButtonDisabled= false
                }
            },
            akey: function() {
                if(this.akey === "") {
                    this.aKeyButtonDisabled = true
                } else {
                    this.aKeyButtonDisabled= false
                }
            }
        },
        methods: {
            updateYKey: async function(){
                const tempkey = this.ykey
                this.ykey = ""
                await axios.put(`${process.env.VUE_APP_STOCKSCLIENTAPI2}/keys/yahoo`, {key: tempkey}, {withCredentials: true})
                    .then(response => (this.resp = response.data))
                    .catch(function(error){this.$toast.error(error)});
                if(this.resp.success === false)
                {
                    this.$toast.error(this.resp.data, {
                    dismissible: true
                    });
                }
                else
                {
                    this.$toast.success(this.resp.data, {
                    dismissible: true
                    });
                }
            },
            updateAKey: async function(){
                const tempkey = this.akey
                this.akey = ""
                await axios.put(`${process.env.VUE_APP_STOCKSCLIENTAPI2}/keys/alpha`, {key: tempkey}, {withCredentials: true})
                    .then(response => (this.resp = response.data))
                    .catch(function(error){this.$toast.error(error)});
                if(this.resp.success === false)
                {
                    this.$toast.error(this.resp.data, {
                    dismissible: true
                    });
                }
                else
                {
                    this.$toast.success(this.resp.data, {
                    dismissible: true
                    });
                }
            }
        }
    }
</script>
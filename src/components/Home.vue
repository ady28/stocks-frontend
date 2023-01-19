<template>
    <div class="row">
        <div class="col-12 col-lg-6 py-2">
            <LastUpdatedStocks />
        </div>
        <div class="col-12 col-lg-6 py-2">
            <DividendListHome />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import LastUpdatedStocks from './LastUpdatedStocks.vue'
import DividendListHome from './DividendListHome'
    export default {
        name: 'HomePage',
        components: {
            LastUpdatedStocks,
            DividendListHome
        },
        async mounted() {
            await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI2}/auth/me`, {withCredentials: true})
            .then(res => {
                if(res.data.success == false) {
                    this.$store.commit('SET_USER', {data:{email:"",name:"",role:""}})
                }
            }) 
            .catch(err => {
                console.log(err);                          
                this.$store.commit('SET_USER', {data:{email:"",name:"",role:""}})
            });
        }
    }
</script>
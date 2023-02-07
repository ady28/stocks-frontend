<template>
    <div>
        <div class="row text-center py-1">
            <span class="h2">{{stock.name}} ({{stock.ticker}})</span>
        </div>
        <div class="row text-center py-1">
            <span class="h5">Last updated on: {{formatDate(stock.lastupdated)}}</span>
        </div>
        <div class="row text-center py-1">
            <ul class="nav nav-pills justify-content-center" data-bs-tabs="pills" role="tablist">
                <li class="nav-item"><a class="nav-link active" aria-current="true" data-bs-toggle="tab" id="overviewLink" href="#overview">Overview</a></li>
                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" id="ratiosLink" href="#ratios">Ratios</a></li>
                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" id="graphsLink" href="#graphs">Graphs</a></li>
                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" id="valueLink" href="#value">Value</a></li>
                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" id="actionsLink" href="#actions">Actions</a></li>
            </ul>
        </div>
        <div class="tab-content">
            <div class="tab-pane active show fade" role="tabpanel" id="overview"  aria-labelledby="overviewLink">
                <StockOverview v-bind:stock="stock" />
            </div>
            <div class="tab-pane fade" role="tabpanel" id="ratios"  aria-labelledby="ratiosLink">
                Ratios
            </div>
            <div class="tab-pane fade" role="tabpanel" id="graphs"  aria-labelledby="graphsLink">
                <StockGraph v-bind:loaded="loaded" v-bind:stock="stock"/>
            </div>
            <div class="tab-pane fade" role="tabpanel" id="actions"  aria-labelledby="actionsLink">
                <StockActions v-on:deleteSt="deleteStock" v-bind:stock="stock"/>
            </div>
            <div class="tab-pane fade" role="tabpanel" id="value"  aria-labelledby="valueLink">
                <StockValue v-bind:stock="stock" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import StockGraph from './StockGraph'
import StockValue from './StockValue'
import StockActions from './StockActions'
import StockOverview from './StockOverview'

export default {
    name: 'StockData',
    components: { StockGraph, StockValue, StockActions, StockOverview },
    data: function() {
        return {
            stock: {},
            ticker: '',
            loaded: false
        }
    },
    async mounted() {
        this.loaded = false
        axios.defaults.withCredentials = true;
        this.ticker = this.$route.params.ticker.toUpperCase();
        await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${this.ticker}`)
        .then(response => (this.stock = response.data.data));
        this.loaded = true
    },
    methods: {
        deleteStock: async function() {
            await axios.delete(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${this.ticker}`, {withCredentials: true})
            .then(response => (this.resp = response.data))
            .catch(error => {this.$toast.error(error.response.data.error)});

            if(this.resp.success === false)
            {
                this.$toast.error(this.resp.data, {
                dismissible: true
                });
            }
            else
            {
                this.$router.push({name: 'home'})
                this.$toast.success("Stock deleted", {
                dismissible: true
                });
            }
        },
        formatDate: function(date) {
            return moment(new Date(date)).format("DD-MM-YYYY")
        }
    }
}
</script>

<style>
.tab-content > .tab-pane:not(.active),
.pill-content > .pill-pane:not(.active) {
    display: block;
    height: 0;
    overflow-y: hidden;
}
.nav-pills
.nav-link.active {
    background-color: black;
}
.nav-pills
.nav-link {
    color: black;
}
.tab-content {
    background-color: #F7F7F7;
    border: thin solid;
    border-color: black;
}

</style>

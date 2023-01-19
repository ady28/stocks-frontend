<template>
    <div>
        <div class="card text-center">
            <div class="card-header h5">
                {{cardTitle}}
            </div>
            <div class="card-body table-responsive-lg">
                <table class="table table-striped table-hover align-middle">
                    <thead>
                        <tr class="table-dark">
                            <th scope="col"></th>
                            <th scope="col">Ticker</th>
                            <th scope="col">Name</th>
                            <th scope="col">PE</th>
                            <th scope="col">PB</th>
                            <th scope="col">Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in stocks" v-bind:key="item._id" class='clickable-row' v-on:click="goToStock(item.ticker)">
                            <td @click.stop data-bs-toggle="tooltip" data-bs-placement="top" title="Open in new tab"><button v-on:click="goToStockN(item.ticker)" type="button" class="btn btn-sm btn-light"><font-awesome-icon icon="window-restore" /></button></td>
                            <td>{{item.ticker}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.trailingpenice}}</td>
                            <td>{{item.pricetobooknice}}</td>
                            <td>{{formatDate(item.lastupdated)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
export default {
    name: 'LastUpdatedStocks',
    components: {
        FontAwesomeIcon
    },
    data: function() {
        return {
            stocks: [],
            cardTitle: "Last 10 added/updated stocks"
        }
    },
    async mounted() {
        await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}?select=name,ticker,pricetobooknice,lastupdated,trailingpenice&sort=-lastupdated&limit=10`)
        .then(response => (this.stocks = response.data.data));
    },
    methods: {
    formatDate: function(date) {
            return moment(new Date(date)).format("DD-MM-YYYY")
        },
    goToStock: function(ticker) {
            this.$router.push({name: 'stock', params: {ticker: ticker}})
        },
    goToStockN: function(ticker) {
            let route = this.$router.resolve({ path: `/stocks/${ticker}` });
            window.open(route.href);
        }
    }
}
</script>

<style>
.clickable-row {
    cursor: pointer
}
</style>
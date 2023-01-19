<template>
    <div class="py-2">
        <div class="card text-center">
            <div class="card-header h6">
                <form>
                    <div class="row g-3 align-items-center">
                        <div class="col-auto">
                            <label for="inputStockTicker" class="col-form-label">Ticker:</label>
                        </div>
                        <div class="col-auto">
                            <input type="text" id="inputStockTicker" class="form-control" placeholder="Search for ticker" v-model="searchTicker">
                        </div>
                        <div class="col-auto">
                            <label for="inputStockLimit" class="col-form-label">Stocks per page:</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" v-model="limit">
                                <option disabled value="">Select number</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="150">150</option>
                                <option value="200">200</option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <label for="inputStockSort" class="col-form-label">Sort by:</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" v-model="sort">
                                <option disabled value="">Select field</option>
                                <option value="lastupdated">Last update date</option>
                                <option value="name">Stock name</option>
                                <option value="ticker">Stock ticker</option>
                                <option value="trailingpe">PE</option>
                                <option value="pricetobook">PB</option>
                                <option value="roic">ROIC</option>
                                <option value="debttoequity">DE</option>
                                <option value="pegratio">PEG</option>
                                <option value="returnonequity">ROE</option>
                                <option value="profitmargins">Profit margin</option>
                                <option value="recommendationkey">Recommendation</option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" v-model="order">
                                <option disabled value="N">Select</option>
                                <option value="">Asc</option>
                                <option value="-">Desc</option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <label for="inputStockIndustry" class="col-form-label">Industry:</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" v-model="searchIndustry">
                                <option value="">All</option>
                                <option v-for="industry in industries" v-bind:key="industry" :value="replaceAmp(industry)">{{industry}}</option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <label for="inputStockSector" class="col-form-label">Sector:</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" v-model="searchSector">
                                <option value="">All</option>
                                <option v-for="sector in sectors" v-bind:key="sector" :value="replaceAmp(sector)">{{sector}}</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="card-body table-responsive-lg">
                <table class="table table-hover align-middle table-fixed">
                    <thead>
                        <tr class="table-dark">
                            <th scope="col"></th>
                            <th scope="col">Stock</th>
                            <th scope="col">PE</th>
                            <th scope="col">PB</th>
                            <th scope="col">ROIC</th>
                            <th scope="col">DE</th>
                            <th scope="col">PEG</th>
                            <th scope="col">ROE</th>
                            <th scope="col">Profit</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in stocks" v-bind:key="item._id" class='clickable-row' v-on:click="goToStock(item.ticker)">
                            <td @click.stop data-bs-toggle="tooltip" data-bs-placement="top" title="Open in new tab"><button v-on:click="goToStockN(item.ticker)" type="button" class="btn btn-sm btn-light"><font-awesome-icon icon="window-restore" /></button></td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Stock name and ticker">{{item.name}} ({{item.ticker}})</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="PE">{{item.trailingpenice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="PB">{{item.pricetobooknice}}</td>
                            <td v-if="item.roic" data-bs-toggle="tooltip" data-bs-placement="top" title="ROIC">{{formatNumber(item.roic)}}%</td>
                            <td v-if="!item.roic" data-bs-toggle="tooltip" data-bs-placement="top" title="ROIC"></td>
                            <td v-if="item.debttoequity" data-bs-toggle="tooltip" data-bs-placement="top" title="DE">{{formatNumber(item.debttoequity)}}</td>
                            <td v-if="!item.debttoequity" data-bs-toggle="tooltip" data-bs-placement="top" title="DE"></td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="PEG">{{item.pegrationice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="ROE">{{item.returnonequitynice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Profit Margin">{{item.profitmarginsnice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Recommendation">{{item.recommendationkey}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Last updated date">{{formatDate(item.lastupdated)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <nav class="py-1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item clickable-row" v-bind:class="{disabled: prevDisable}" v-on:click="prevPage">
                    <a class="page-link">Previous</a>
                </li>
                <li class="page-item clickable-row" v-bind:class="{disabled: nextDisable}" v-on:click="nextPage">
                    <a class="page-link">Next</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

export default {
    name: 'StocksRatioList',
    components: {
        FontAwesomeIcon
    },
    data: function() {
        return {
            stocks: [],
            industries: [],
            sectors: [],
            page: 1,
            limit: 50,
            pagination: {},
            prevDisable: true,
            nextDisable: true,
            sort: "pricetobook",
            order: "",
            searchTicker: "",
            searchIndustry: "",
            searchSector: ""
        }
    },
    async mounted() {
        this.getStocks();
        this.getIndustries();
        this.getSectors();
    },
    computed: {
        finalOrder: function() {
            return this.order + this.sort
        }
    },
    methods: {
        formatDate: function(date) {
                return moment(new Date(date)).format("DD-MM-YYYY")
            },
        goToStock: function(ticker) {
                this.$router.push({name: 'stock', params: {ticker: ticker}})
            },
        replaceAmp: function(name) {
            return name.replaceAll("&", "%26")
        },
        formatNumber: function(num) {
                return parseFloat(num).toFixed(2)
            },
        getIndustries: async function() {
            await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/industry/distinct`)
            .then(response => {this.industries = response.data.data});
        },
        getSectors: async function() {
            await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/sector/distinct`)
            .then(response => {this.sectors = response.data.data});
        },
        getStocks: async function() {
            await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}?ticker[regex]=${this.searchTicker}&industry[regex]=${this.searchIndustry}&sector[regex]=${this.searchSector}&select=name,ticker,profitmarginsnice,recommendationkey,returnonequitynice,pegrationice,debttoequity,roic,pricetobooknice,lastupdated,trailingpenice&sort=${this.finalOrder}&page=${this.page}&limit=${this.limit}`)
            .then(response => {this.stocks = response.data.data
                            this.pagination = response.data.pagination});
            
            if(this.pagination.prev) {
                this.prevDisable = false;
            } else {
                this.prevDisable = true;
                }
            if(this.pagination.next) {
                this.nextDisable = false;
            } else {
                this.nextDisable = true;
                }
        },
        nextPage: function() {
            this.page = this.pagination.next.page;
            this.getStocks();
        },
        prevPage: function() {
            this.page = this.pagination.prev.page;
            this.getStocks();
        },
        goToStockN: function(ticker) {
            let route = this.$router.resolve({ path: `/stocks/${ticker}` });
            window.open(route.href);
        }
    },
    watch: {
        searchTicker: function() {
            this.searchTicker = this.searchTicker.toUpperCase();
            this.page = 1
            this.getStocks();
        },
        limit: function() {
            this.page = 1
            this.getStocks();
        },
        sort: function() {
            this.page = 1;
            this.getStocks();
        },
        order: function() {
            this.page = 1;
            this.getStocks();
        },
        searchIndustry: function() {
            this.page = 1;
            this.getStocks();
        },
        searchSector: function() {
            this.page = 1;
            this.getStocks();
        }
    }
}
</script>

<style>
.clickable-row {
    cursor: pointer
}
</style>
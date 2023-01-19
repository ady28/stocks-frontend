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
                            <input type="text" id="inputStockTicker" class="form-control" placeholder="Enter ticker" v-model="searchTicker">
                        </div>
                        <div class="col-auto">
                            <button v-on:click="getStock" type="button" class="btn btn-primary" v-bind:disabled="addButtonDisable">Add to list</button>
                        </div>
                        <div class="col-auto">
                            <button v-on:click="resetList" type="button" class="btn btn-danger" v-bind:disabled="resetButtonDisable">Reset list</button>
                        </div>
                    </div>
                </form>
            </div>
            <h5>Ratio data table</h5>
            <div class="card-body table-responsive-lg">
                <table class="table table-hover align-middle table-fixed">
                    <thead>
                        <tr class="table-dark">
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
            <h5>Dividend data table</h5>
            <div class="card-body table-responsive-lg">
                <table class="table table-hover align-middle table-fixed">
                    <thead>
                        <tr class="table-dark">
                            <th scope="col">Stock</th>
                            <th scope="col">PE</th>
                            <th scope="col">EPS</th>
                            <th scope="col">Yield</th>
                            <th scope="col">Payout</th>
                            <th scope="col">Growth 5Y</th>
                            <th scope="col">ExDiv. Date</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in stocks" v-bind:key="item._id" class='clickable-row' v-on:click="goToStock(item.ticker)">
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Stock name and ticker">{{item.name}} ({{item.ticker}})</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="PE">{{item.trailingpenice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="EPS">{{item.trailingepsnice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Yield">{{item.dividendyieldnice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Payout">{{item.payoutrationice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Growth 5Y">{{item.growth5ynice}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="ExDiv. Date">{{formatDate(item.exdividenddate)}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Recommendation">{{item.recommendationkey}}</td>
                            <td data-bs-toggle="tooltip" data-bs-placement="top" title="Last updated date">{{formatDate(item.lastupdated)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment';

export default {
    name: 'StocksCompareTable',
    data: function() {
        return {
            stocks: [],
            searchTicker: "",
            addButtonDisable: true,
            resetButtonDisable: true
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
            return name.replace("&", "%26")
        },
        formatNumber: function(num) {
                return parseFloat(num).toFixed(2)
            },
        getStock: async function() {
            const isElementPresent = this.stocks.some((o) => o.ticker === this.searchTicker);
            if(!isElementPresent) {
                try {
                    let response = await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${this.searchTicker}`);
                    this.stocks.push(response.data.data);

                    this.searchTicker = ''
                    if(this.stocks.length > 0) {
                        this.resetButtonDisable = false
                    } else {
                        this.resetButtonDisable = true
                    }
                }
                catch(error) {
                    this.$toast.error(error.response.data.error);
                }
            }   

        },
        resetList: function() {
            this.stocks = []
            this.resetButtonDisable = true
        }
    },
    watch: {
        searchTicker: function() {
            this.searchTicker = this.searchTicker.toUpperCase();
            if(this.searchTicker === "") {
                this.addButtonDisable = true
            } else if(this.stocks.length <= 8) {
                this.addButtonDisable = false
            }
        }
    }
}
</script>

<style>
.clickable-row {
    cursor: pointer
}
</style>
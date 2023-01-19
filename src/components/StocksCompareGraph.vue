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
            <h5>Data graphs</h5>
            <div v-if="loaded" class="card-body">
                <div class="row">
                    <div class="col">
                        <h6>Net Income</h6>
                    </div>
                    <div class="col">
                        <h6>Free Cash Flow</h6>
                    </div>
                    <div class="col">
                        <h6>Operating Cash Flow</h6>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-lg-4">
                        <Bar v-if="loaded"
                                            :height="chartHeight"
                                            :width="chartWidth"
                                            :chart-data="chartData1"
                                            :chart-options="chartOptions" />
                    </div>
                    <div class="col-12 col-lg-4">
                        <Bar v-if="loaded"
                                            :height="chartHeight"
                                            :width="chartWidth"
                                            :chart-data="chartData2"
                                            :chart-options="chartOptions" />
                    </div>
                    <div class="col-12 col-lg-4">
                        <Bar v-if="loaded"
                                            :height="chartHeight"
                                            :width="chartWidth"
                                            :chart-data="chartData3"
                                            :chart-options="chartOptions" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'StocksCompareGraph',
    components: {Bar},
    data: function() {
        return {
            stocks: [],
            barColors: ["#AA2211","#33BB22","#3322EE"],
            searchTicker: "",
            addButtonDisable: true,
            resetButtonDisable: true,
            genButtonDisable: true,
            loaded: false,
            chartLabels1: [],
            dataSetChart1: [],
            dataSetChart2: [],
            dataSetChart3: [],
            chartOptions: {
                responsive: true,
                maintainAspectRatio:false,
                scales: {
                    y: {
                        ticks: {
                            display: false,
                        }
                    }
                },
                parsing: {
                    xAxisKey: 'id'
    }
            },
            chartHeight: 300,
            chartWidth: 300
        }
    },
    methods: {
        getStock: async function() {
            const isElementPresent = this.stocks.some((o) => o.ticker === this.searchTicker);
            if(!isElementPresent) {
                try {
                    let response = await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${this.searchTicker}`);
                    this.stocks.push(response.data.data);

                    this.searchTicker = ''
                    if(this.stocks.length > 0) {
                        this.resetButtonDisable = false
                        if(this.stocks[0].cashflowh.map(ed => ed.enddatey).length < this.stocks[this.stocks.length-1].cashflowh.map(ed => ed.enddatey).length) {
                            this.$toast.error("The financial data for the new stock has more years/quarters than the current ones. Reset list and add this one first.");
                            this.stocks.pop()
                        } else {
                            this.chartLabels1 = this.stocks[0].cashflowh.map(ed => ed.enddatey)
                            this.dataSetChart1.push({ label: this.stocks[this.stocks.length-1].ticker, data: this.stocks[this.stocks.length-1].cashflowh.map(ni => ({id: ni.enddatey, y: ni.netincome})), backgroundColor: this.barColors[this.stocks.length-1] })
                            this.dataSetChart2.push({ label: this.stocks[this.stocks.length-1].ticker, data: this.stocks[this.stocks.length-1].cashflowh.map(ca => ({id: ca.enddatey, y: ca.totalcashoperating+ca.capex})), backgroundColor: this.barColors[this.stocks.length-1] })
                            this.dataSetChart3.push({ label: this.stocks[this.stocks.length-1].ticker, data: this.stocks[this.stocks.length-1].cashflowh.map(ni => ({id: ni.enddatey, y: ni.totalcashoperating})), backgroundColor: this.barColors[this.stocks.length-1] })
                            this.loaded = true
                        }
                    } else {
                        this.resetButtonDisable = true
                        this.loaded = false
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
            this.loaded = false
            this.dataSetChart1 = []
            this.dataSetChart2 = []
            this.dataSetChart3 = []
        }
    },
    computed: {
        chartData1() {
                return {
                            labels: this.chartLabels1,
                            datasets: this.dataSetChart1
                        }
        },
        chartData2() {
                return {
                            labels: this.chartLabels1,
                            datasets: this.dataSetChart2
                        }
        },
        chartData3() {
                return {
                            labels: this.chartLabels1,
                            datasets: this.dataSetChart3
                        }
        }
    },
    watch: {
        searchTicker: function() {
            this.searchTicker = this.searchTicker.toUpperCase();
            if(this.searchTicker === "") {
                this.addButtonDisable = true
            } else if(this.stocks.length <= 3) {
                this.addButtonDisable = false
            }
        }
    }
}
</script>
<template>
    <div>
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
        <div class="row">
            <div class="col-12 col-lg-4">
                <Bar v-if="loaded"
                                    :height="chartHeight"
                                    :width="chartWidth"
                                    :chart-data="chartData4"
                                    :chart-options="chartOptions" />
            </div>
            <div class="col-12 col-lg-4">
                <Bar v-if="loaded"
                                    :height="chartHeight"
                                    :width="chartWidth"
                                    :chart-data="chartData5"
                                    :chart-options="chartOptions" />
            </div>
            <div class="col-12 col-lg-4">
                <Bar v-if="loaded"
                                    :height="chartHeight"
                                    :width="chartWidth"
                                    :chart-data="chartData6"
                                    :chart-options="chartOptions" />
            </div>
        </div>
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'StockGraph',
    components: {Bar},
    props: ["stock", "loaded"],
    data: function() {
        return {
            chartData1: {},
            chartData2: {},
            chartData3: {},
            chartData4: {},
            chartData5: {},
            chartData6: {},
            chartOptions: {
                responsive: true,
                maintainAspectRatio:false,
                scales: {
                    y: {
                        ticks: {
                            display: false,
                        }
                    }
                }
            },
            chartHeight: 300,
            chartWidth: 300
        }
    },
    watch: {
        stock: function() {
            this.chartData1 = {
                labels: this.stock.incomeh.map(ed => ed.enddatey),
                datasets: [ { label: "Net Income", data: this.stock.incomeh.map(ni => ni.netincome), backgroundColor: "#112255" } ]
            }
            this.chartData2 = {
                labels: this.stock.cashflowh.map(ed => ed.enddatey),
                datasets: [ { label: "Free Cash Flow", data: this.stock.cashflowh.map(ca => ca.totalcashoperating+ca.capex), backgroundColor: "#662255" } ]
            }
            this.chartData3 = {
                labels: this.stock.cashflowhq.map(ed => ed.enddatey),
                datasets: [ { label: "Total operating cash", data: this.stock.cashflowhq.map(tco => tco.totalcashoperating), backgroundColor: "#337655" } ]
            }
            this.chartData4 = {
                labels: this.stock.balanceh.map(ed => ed.enddatey),
                datasets: [ { label: "Cash", data: this.stock.balanceh.map(tco => tco.cash), backgroundColor: "#112255" } ]
            }
            this.chartData5 = {
                labels: this.stock.incomehq.map(ed => ed.enddatey),
                datasets: [ { label: "Net income", data: this.stock.incomehq.map(tco => tco.netincome), backgroundColor: "#662255" } ]
            }
            this.chartData6 = {
                labels: this.stock.balancehq.map(ed => ed.enddatey),
                datasets: [ { label: "Cash", data: this.stock.balancehq.map(tco => tco.cash), backgroundColor: "#337655" } ]
            }
        }
    }
}
</script>

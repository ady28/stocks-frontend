<template>
    <div v-if="$store.state.user.email != ''">
        <div class="row m-3"><h4>DCF calculation</h4></div>
        <div class="row m-3">
            <div class="col">
                <h5>Data input</h5>
                <form>
                    <div class="row mb-3 align-items-center">
                        <div class="col">
                            <label for="inputStockGrowth" class="col-form-label">Growth 1Y-5Y:</label>
                        </div>
                        <div class="col">
                            <input type="text" id="inputStockGrowth" class="form-control" placeholder="Growth 5Y" v-model="stockGrowth">
                        </div>
                        <div class="col">
                            <label for="inputStockGrowth" class="col-form-label">{{formatNumber(stockGrowth*100)}}%</label>
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col">
                            <label for="inputStockGrowth10" class="col-form-label">Growth 6Y-10Y:</label>
                        </div>
                        <div class="col">
                            <input type="text" id="inputStockGrowth10" class="form-control" placeholder="Growth 5Y-10Y" v-model="stockGrowth10">
                        </div>
                        <div class="col">
                            <label for="inputStockGrowth10" class="col-form-label">{{formatNumber(stockGrowth10*100)}}%</label>
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col">
                            <label for="inputStockRateOfReturn" class="col-form-label">Rate of return/Y:</label>
                        </div>
                        <div class="col">
                            <input type="text" id="inputStockRateOfReturn" class="form-control" placeholder="Rate of return/Y" v-model="stockRateOfReturn">
                        </div>
                        <div class="col">
                            <label for="inputStockGrowth10" class="col-form-label">{{stockRateOfReturn}}%</label>
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col">
                            <label for="inputStockTerminalValue" class="col-form-label">Terminal value:</label>
                        </div>
                        <div class="col">
                            <input type="text" id="inputStockTerminalValue" class="form-control" placeholder="Terminal value" v-model="stockTerminalValue">
                        </div>
                        <div class="col">
                            <label for="inputStockTerminalValue" class="col-form-label">Between 10-15</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col">
                <h5>Results</h5>
                <div v-if="stockValue != 0">
                    <div class="row mb-3 align-items-center">
                        <div class="col">
                            <label class="col-form-label">Current price:</label>
                        </div>
                        <div class="col">
                            <label class="col-form-label">{{stock.price}}</label>
                        </div>
                        <div class="col">
                            <label class="col-form-label">Fair Value:</label>
                        </div>
                        <div class="col">
                            <label class="col-form-label">{{formatNumber(stockValue)}}</label>
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col">
                            <label class="col-form-label">Margin 20%:</label>
                        </div>
                        <div class="col">
                            <label v-if="stockValue >= 0" class="col-form-label">{{formatNumber(stockValue-(stockValue*0.2))}}</label>
                            <label v-if="stockValue < 0" class="col-form-label">{{formatNumber(stockValue+(stockValue*0.2))}}</label>
                        </div>
                        <div class="col">
                            <label class="col-form-label">Margin 30%:</label>
                        </div>
                        <div class="col">
                            <label v-if="stockValue >= 0" class="col-form-label">{{formatNumber(stockValue-(stockValue*0.3))}}</label>
                            <label v-if="stockValue < 0" class="col-form-label">{{formatNumber(stockValue+(stockValue*0.3))}}</label>
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col">
                            <label class="col-form-label">Margin 40%:</label>
                        </div>
                        <div class="col">
                            <label v-if="stockValue >= 0" class="col-form-label">{{formatNumber(stockValue-(stockValue*0.4))}}</label>
                            <label v-if="stockValue < 0" class="col-form-label">{{formatNumber(stockValue+(stockValue*0.4))}}</label>
                        </div>
                        <div class="col">
                            <label class="col-form-label">Margin 50%:</label>
                        </div>
                        <div class="col">
                            <label v-if="stockValue >= 0" class="col-form-label">{{formatNumber(stockValue-(stockValue*0.5))}}</label>
                            <label v-if="stockValue < 0" class="col-form-label">{{formatNumber(stockValue+(stockValue*0.5))}}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row m-3 align-items-center">
            <div class="col-auto">
                <button v-on:click="calculateDCF" type="button" class="btn btn-primary" v-bind:disabled="calcButtonDisable">Calculate</button>
            </div>
            <div class="col-auto">
                <button v-on:click="resetData" type="button" class="btn btn-danger">Reset data</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StockValue',
    props: ["stock"],
    data: function() {
        return {
            stockGrowth: 0,
            stockGrowth10: 0,
            stockRateOfReturn: 10,
            stockTerminalValue: 15,
            yearOneCashFlow: 0,
            calcButtonDisable: true,
            stockValue: 0
        }
    },
    watch: {
        stock: function() {
            this.stockGrowth = this.stock.growth5y

            var tempCashFlow = 0
            for (var i = 0; i < this.stock.cashflowh.length; i++) {
                tempCashFlow+=this.stock.cashflowh[i].totalcashoperating+this.stock.cashflowh[i].capex
            }
            this.yearOneCashFlow = tempCashFlow/this.stock.cashflowh.length
        },
        stockGrowth: function() {
            if(this.stockGrowth == 0) {
                this.calcButtonDisable = true
            } else {
                this.calcButtonDisable = false
            }
            this.stockGrowth10 = this.stockGrowth/2
        }
    },
    methods: {
        formatNumber: function(num) {
                return parseFloat(num).toFixed(2)
            },
        resetData: function() {
            this.stockGrowth = this.stock.growth5y
            this.stockGrowth10 = this.stockGrowth/2
            this.stockValue = 0
        }, 
        calculateDCF: function() {
            var SumPV=0

            //Year one
            var FCF = this.yearOneCashFlow
            var PV=FCF/Math.pow(1+this.stockRateOfReturn/100,1)
            SumPV+=PV

            //Years 2-5
            for (var y = 2; y <= 5; y++) {
                if(FCF < 0 && this.stockGrowth >= 0) {
                    FCF=FCF-(FCF*this.stockGrowth)
                } else {
                    FCF=FCF+(FCF*this.stockGrowth)
                }
                PV=FCF/Math.pow(1+this.stockRateOfReturn/100,y)
                SumPV+=PV
            }
            //Years 6-10
            for (y = 6; y <= 10; y++) {
                if(FCF < 0 && this.stockGrowth >= 0) {
                    FCF=FCF-(FCF*this.stockGrowth10)
                } else {
                    FCF=FCF+(FCF*this.stockGrowth10)
                }
                PV=FCF/Math.pow(1+this.stockRateOfReturn/100,y)
                SumPV+=PV
            }

            FCF=FCF*this.stockTerminalValue
            PV=FCF/Math.pow(1+this.stockRateOfReturn/100,10)
            SumPV+=PV

            var Value = SumPV + (this.stock.totalcash - this.stock.totaldebt)
            this.stockValue = Value/this.stock.sharesoutstanding
        }
    }
}
</script>
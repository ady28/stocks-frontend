<template>
    <div>
        <div class="row m-3" v-if="stock.competitors">
            <div class="col-12">
                <h5>Competitors</h5>
                <span v-for="competitor in stock.competitors" v-bind:key="competitor">
                    <button v-on:click="addOrGoToStock(competitor)" type="button" class="mx-2 btn btn-sm btn-info" data-bs-toggle="tooltip" data-bs-placement="top" title="Import new stock or go to stock if it exists">{{ competitor }}</button>
                </span>
            </div>
        </div>
        <div class="row m-3">
            <div class="col-12 col-lg-6">
                <h6>Company data</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Name:
                        <span>{{stock.name}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Ticker:
                        <span>{{stock.ticker}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Industry:
                        <span>{{stock.industry}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Sector:
                        <span>{{stock.sector}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Country:
                        <span>{{stock.country}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        City:
                        <span>{{stock.city}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Address:
                        <span>{{stock.address}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Employee number:
                        <span>{{stock.employeeno}}</span>
                    </li>
                </ul>
            </div>
            <div class="col-12 col-lg-6">
                <h6>Analyst data</h6>
                <ul class="list-group">
                    <li :class="{'bg-success': cls_bgsuccess, 'text-white': cls_textwhite, 'text-black': cls_textblack, 'bg-info': cls_bginfo, 'bg-secondary': cls_bgsecondary, 'bg-warning': cls_bgwarning, 'bg-danger': cls_bgdanger}" class="list-group-item d-flex justify-content-between align-items-center">
                        Recommendation:
                        <span>{{stock.recommendationkey}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Target low price:
                        <span>{{stock.targetlowprice}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Target median price:
                        <span>{{stock.targetmedianprice}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Target high price:
                        <span>{{stock.targethighprice}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Current price:
                        <span>{{stock.price}}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Analyst number:
                        <span>{{recomnumber}}</span>
                    </li>
                    <li v-if="recomnumber > 0" class="list-group-item">
                        <div class="progress" data-bs-toggle="tooltip" data-bs-placement="top" title="Green = Strong buy | Blue = Buy | Grey = Hold | Yellow = Sell | Red = Strong sell" data-container="body">
                            <div class="progress-bar bg-success" role="progressbar" aria-label="Segment strong buy" :style="{width: recom_sb/recomnumber*100+'%'}" v-bind:aria-valuenow="recom_sb" aria-valuemin="0" aria-valuemax="100">{{recom_sb}}</div>
                            <div class="progress-bar bg-info" role="progressbar" aria-label="Segment buy" :style="{width: recom_b/recomnumber*100+'%'}" v-bind:aria-valuenow="recom_b" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Buy">{{recom_b}}</div>
                            <div class="progress-bar bg-secondary" role="progressbar" aria-label="Segment hold" :style="{width: recom_h/recomnumber*100+'%'}" v-bind:aria-valuenow="recom_h" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Hold">{{recom_h}}</div>
                            <div class="progress-bar bg-warning" role="progressbar" aria-label="Segment sell" :style="{width: recom_s/recomnumber*100+'%'}" v-bind:aria-valuenow="recom_s" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Sell">{{recom_s}}</div>
                            <div class="progress-bar bg-danger" role="progressbar" aria-label="Segment strong sell" :style="{width: recom_ss/recomnumber*100+'%'}" v-bind:aria-valuenow="recom_ss" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Strong sell">{{recom_ss}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'StockOverview',
    props: ["stock"],
    data: function() {
        return {
            resp: {},
            stockexists: false,
            recomnumber: 0,
            recom_sb: 0,
            recom_b: 0,
            recom_h: 0,
            recom_s: 0,
            recom_ss: 0,
            cls_bgsuccess: false,
            cls_bginfo: false,
            cls_bgsecondary: false,
            cls_bgwarning: false,
            cls_bgdanger: false,
            cls_textwhite: false,
            cls_textblack: false
        }
    },
    methods: {
        addOrGoToStock: async function(ticker) {

            await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${ticker}/exists`)
            .then(response => (this.resp = response.data));
            if(this.resp.data === true) {
                this.$router.push({name: 'stock', params: {ticker: ticker}});
                setTimeout(function(){ 
                    location.reload()
                }, 100);
            } else {
                await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${ticker}/getdata`, {withCredentials: true})
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
                    this.$router.push({name: 'stock', params: {ticker: ticker}});
                    setTimeout(function(){ 
                        location.reload()
                    }, 100);
                    this.$toast.success(this.resp.data, {
                    dismissible: true
                    });
                }
            }
        }
    },
    watch: {
        stock: function() {
            this.recomnumber = this.stock.recommtrend.strongbuy + this.stock.recommtrend.buy + this.stock.recommtrend.hold + this.stock.recommtrend.sell + this.stock.recommtrend.strongsell
            this.recom_sb = this.stock.recommtrend.strongbuy
            this.recom_b = this.stock.recommtrend.buy
            this.recom_h = this.stock.recommtrend.hold
            this.recom_s = this.stock.recommtrend.sell
            this.recom_ss = this.stock.recommtrend.strongsell

            switch(this.stock.recommendationkey) {
                case 'strong_buy':
                    this.cls_bgsuccess = true;
                    this.cls_textwhite = true;
                    break;
                case 'buy':
                    this.cls_bginfo = true;
                    this.cls_textblack = true;
                    break;
                case 'hold':
                    this.cls_bgsecondary = true;
                    this.cls_textwhite = true;
                    break;
                case 'underperform':
                    this.cls_bgwarning = true;
                    this.cls_textblack = true;
                    break;
                case 'sell':
                    this.cls_bgwarning = true;
                    this.cls_textblack = true;
                    break;
                case 'strong_sell':
                    this.cls_bgdange = true;
                    this.cls_textwhite = true;
                    break;
            }
        }
    }
}
</script>
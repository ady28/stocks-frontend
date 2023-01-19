<template>
    <div class="row">
        <StocksSearch  v-on:searchStocks="searchStocks" :filterKey="filterKey" :filterDir="filterDir" v-on:requestKey="setFilterKey" v-on:requestDir="setFilterDir"/>
        <StocksList v-bind:stocks="filteredStocks" v-on:testf="testFunction"/>
    </div>
</template>

<script>
import StocksList from './StocksList1.vue'
import StocksSearch from './StocksSearch.vue'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'StocksView1',
  data: function() {
    return {
      stocks: [],
      searchTerm: "",
      filterKey: "name",
      filterDir: "asc"
    }
  },
  components: {
    StocksList,
    StocksSearch
},
  async mounted() {
    await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}?select=name,ticker,beta,sector,lastupdated&sort=beta`)
      .then(response => (this.stocks = response.data.data));
  },
  computed: {
    searchedStocks: function() {
      return this.stocks.filter(item => {
        return(
          item.name.toLowerCase().match(this.searchTerm.toLowerCase()) ||
          item.ticker.toLowerCase().match(this.searchTerm.toLowerCase())
        )
      });
    },
    filteredStocks: function() {
      return _.orderBy(
        this.searchedStocks,
        item => {
          return item[this.filterKey];
        },
        this.filterDir
      );
    }
  },
  methods: {
    testFunction : function(stock) {
      console.log(`${stock._id}`)
    },
    searchStocks : function(term) {
      this.searchTerm = term;
    },
    setFilterKey : function(value) {
      this.filterKey = value
    },
    setFilterDir : function(value) {
      this.filterDir = value
    }
  }
}

</script>
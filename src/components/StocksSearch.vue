<template>
      <div>
        <div class="input-group my-2">
            <input
                id="SearchStocks"
                placeholder="Search"
                type="text"
                class="form-control me-1"
                aria-label="Search Stocks"
                v-model="searchTerm"
            >
            <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Sort by
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" class="dropdown-item d-flex justify-content-between" id="name" v-on:click="$emit('requestKey', 'name')">
                    Stock Name
                    <font-awesome-icon icon="check" v-if="filterKey==='name'"/>
                </a>

                <a class="dropdown-item d-flex justify-content-between" href="#" id="lastupdated" v-on:click="$emit('requestKey', 'lastupdated')">
                    Last Update Date
                    <font-awesome-icon icon="check" v-if="filterKey==='lastupdated'"/>
                </a>

                <a href="#" class="dropdown-item d-flex justify-content-between" id="ticker" v-on:click="$emit('requestKey', 'ticker')">
                    Ticker
                    <font-awesome-icon icon="check" v-if="filterKey==='ticker'"/>
                </a>

                <div class="dropdown-divider" role="separator"></div>

                <a
                    class="dropdown-item d-flex justify-content-between"
                    href="#"
                    id="asc"
                    v-on:click="$emit('requestDir', 'asc')"
                >
                    Asc
                    <font-awesome-icon icon="check" v-if="filterDir==='asc'"/>
                </a>

                <a
                    class="dropdown-item d-flex justify-content-between"
                    href="#"
                    id="desc"
                    v-on:click="$emit('requestDir', 'desc')"
                >
                    Desc
                    <font-awesome-icon icon="check" v-if="filterDir==='desc'"/>
                </a>
            </div>
        </div>
  </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

export default {
  name: 'StocksSearch',
  data() {
    return {
        searchTerm: ""
    }
  },
  props: ["filterKey", "filterDir"],
  watch: {
    searchTerm: function() {
        this.$emit("searchStocks", this.searchTerm);
    }
  },
  components: {
    FontAwesomeIcon
  }
}

</script>
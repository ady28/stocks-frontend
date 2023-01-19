<template>
        <div class="list-group list-group-flush">
            <div class="list-group-item d-flex align-items-start" v-for="item in stocks" v-bind:key="item._id">
                <button class="me-2 btn btn-sm btn-primary"
                    v-on:click="$emit('testf', item)">
                    <font-awesome-icon icon="info" />
                </button>
                <div class="w-100">
                    <div class="d-flex justify-content-between">
                        <span class="h4 text-primary">{{item.name}}</span>
                        <span class="float-right">Updated: {{formatDate(item.lastupdated)}}</span>
                    </div>
                    <div class="stock-data">
                        <span class="font-weight-bold mr-1"> Some stock data:</span>
                        <span>Ticker is {{item.ticker}} and beta is {{item.beta}}</span>
                    </div>
                    <div>
                        Sector is {{item.sector}}
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import moment from 'moment'

export default {
  name: 'StocksList1',
  props: ["stocks"],
  components: {
    FontAwesomeIcon
  },
  methods: {
    formatDate: function(date) {
        return moment(new Date(date)).format("DD-MM-YYYY")
    }
  }   
}
</script>
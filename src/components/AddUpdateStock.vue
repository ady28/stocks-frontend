<template>
      <form class="d-flex">
        <div class="input-group">
            <input
                id="AddUpdStock"
                placeholder="Ticker"
                type="text"
                class="form-control me-2"
                aria-label="Add/Update Stock"
                v-model="ticker"
            >
            <button v-on:click="addUpdateBtn" type="button" class="btn btn-sm btn-success" v-bind:disabled="addUpdButtonDisable"><font-awesome-icon icon="plus" /> Add/Update stock</button>
        </div>
      </form>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import axios from 'axios'

export default {
  name: 'AddUpdateStock',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
        ticker: "",
        addUpdButtonDisable: true,
        resp: {}
    }
  },
  watch: {
    ticker: function() {
      if(this.ticker === "") {
        this.addUpdButtonDisable = true
      } else {
        this.addUpdButtonDisable= false
      }
      this.ticker = this.ticker.toUpperCase();
    }
  },
  methods: {
    addUpdateBtn: async function() {
      let tempTicker = this.ticker
      this.ticker = ""
      await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${tempTicker}/getdata`, {withCredentials: true})
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
        this.$toast.success(this.resp.data, {
          dismissible: true
        });
      }
    }
  }
}
</script>
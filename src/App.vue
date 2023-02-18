<template>
  <div id="main-app" class="container-fluid overflow-hidden">
    <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
      <div class="container-fluid">
        <router-link :to="{name: 'home'}" class="navbar-brand h1 mb-0">{{title}}</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle active" id="stocksListsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Stocks Lists
              </a>
              <ul class="dropdown-menu" aria-labelledby="stocksListsDropdown">
                <li>
                  <router-link class="dropdown-item" :to="{name: 'stocksratio'}">Ratios</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" :to="{name: 'stocksdividend'}">Dividends</router-link>
                </li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle active" id="stocksListsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Compare Stocks
              </a>
              <ul class="dropdown-menu" aria-labelledby="stocksListsDropdown">
                <li>
                  <router-link class="dropdown-item" :to="{name: 'stockscomparetable'}">Table</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" :to="{name: 'stockscomparegraph'}">Graph</router-link>
                </li>
              </ul>
            </li>
          </ul>
          <AddUpdateStock v-if="$store.state.user.email != ''"/>
          <router-link :to="{name: 'settings'}" v-if="$store.state.user.role == 'admin'">
            <button type="button" class="btn btn-secondary ms-2"><font-awesome-icon icon="fas fa-cog" /></button>
          </router-link>
          <router-link v-if="$store.state.user.email == ''" :to="{name: 'login'}">
            <button type="button" class="btn btn-secondary ms-2">Log in</button>
          </router-link>
          <button v-on:click="doLogout" v-if="$store.state.user.email != ''" data-bs-toggle="tooltip" data-bs-placement="top" :title="`Log out ${$store.state.user.name}`" type="button" class="btn btn-secondary ms-2">Log out</button>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import AddUpdateStock from './components/AddUpdateStock.vue'

export default {
  name: 'MainApp',
  data: function() {
    return {
      title: "Yield Hunters"
    }
  },
  components: {
    AddUpdateStock,
    FontAwesomeIcon
  },
  mounted() {
    document.title = "Yield Hunters";
  },
  methods: {
            doLogout: async function() {
                await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI2}/auth/logout`, {withCredentials: true})
                .then(response => (this.resp = response))
                .catch(function(error){this.$toast.error(error)});

                if(this.resp.success === false)
                {
                    this.$toast.error(this.resp.data, {
                    dismissible: true
                    });
                }
                else
                {
                    this.$store.commit('SET_USER', {data:{email:"",name:"",role:""}})
                    this.$router.push({name: 'home'})
                    this.$toast.success("Logged out", {
                    dismissible: true
                    });
                }
            }
        }
}
</script>

<style>
body {
   padding-bottom: 50px;
   background-color: rgb(35, 35, 35);
}
</style>

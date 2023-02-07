<template>
    <div v-if="$store.state.user.role == 'admin'">
        <div class="row m-3 align-items-center">
            <div class="col-auto">
                <label for="inputStockTicker" class="col-form-label">Rename stock:</label>
            </div>
            <div class="col-auto">
                <input v-model="newName" type="text" id="inputStockTicker" class="form-control" placeholder="Enter ticker">
            </div>
            <div class="col-auto">
                <button v-on:click="renameStock" type="button" class="btn btn-primary" v-bind:disabled="renButtonDisable">Rename stock</button>
            </div>
            <div class="col-auto">
                <button v-on:click="updateStock" type="button" class="btn btn-success">Update stock</button>
            </div>
            <div class="col-auto">
                <button data-bs-toggle="modal" data-bs-target="#deleteModal" type="button" class="btn btn-danger">Delete stock</button>
            </div>
        </div>

        <div class="row m-3 align-items-center">
            <div class="col-auto">
                <label class="col-form-label">Remove yearly/quarterly financial data:</label>
            </div>
            <div class="col-auto">
                            <select class="form-select" v-model="type">
                                <option disabled value="">Select data type</option>
                                <option value="cashflowh">Cash flow annual</option>
                                <option value="cashflowhq">Cash flow quarterly</option>
                                <option value="incomeh">Income annual</option>
                                <option value="incomehq">Income quarterly</option>
                                <option value="balanceh">Balance sheet annual</option>
                                <option value="balancehq">Balance sheet quarterly</option>
                            </select>
            </div>
            <div class="col-auto">
                <input v-model="endDateY" type="text" id="inputEndDateY" class="form-control" placeholder="Enter YYYY or YYYY-QN">
            </div>
            <div class="col-auto">
                <button data-bs-toggle="modal" data-bs-target="#removeModal" v-on:click="removeStockData" type="button" class="btn btn-primary" v-bind:disabled="removeButtonDisable">Remove data</button>
            </div>
        </div>

        <div class="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Delete stock</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    The stock and all data about it will be deleted permanently. Are you sure?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button v-on:click="$emit('deleteSt')" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="removeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Remove stock data</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    The stock data refferenced by the type and date will be permanently deleted. Are you sure?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button v-on:click="deleteStData" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'StockActions',
    props: ['stock'],
    data: function() {
        return {
            renButtonDisable: true,
            newName: "",
            removeButtonDisable: true,
            endDateY: "",
            type: ""
        }
    },
    watch: {
        newName: function() {
            this.newName = this.newName.toUpperCase();
            if(this.newName === "") {
                this.renButtonDisable = true
            } else {
                this.renButtonDisable = false
            }
        },
        type: function() {
            if(this.type != "" && this.endDateY != "") {
                this.removeButtonDisable = false
            } else {
                this.removeButtonDisable = true
            }
        },
        endDateY: function() {
            this.endDateY = this.endDateY.toUpperCase();
            if(this.type != "" && this.endDateY != "") {
                this.removeButtonDisable = false
            } else {
                this.removeButtonDisable = true
            }
        }
    },
    methods: {
        renameStock: async function() {
            const tempName = this.newName
            this.newName = ''

            await axios.put(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${this.stock.ticker}/rename/${tempName}`, {withCredentials: true})
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
                this.$router.push({name: 'home'})
                this.$toast.success("Stock renamed", {
                dismissible: true
                });
            }
        },
        deleteStData: async function() {
            const tempEndDateY = this.endDateY
            this.endDateY = ""
            const tempType = this.type
            this.type = ""

            await axios.put(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${this.stock.ticker}/removefindata/${tempType}/${tempEndDateY}`, {withCredentials: true})
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
                setTimeout(function(){ 
                    location.reload()
                }, 2000);       
                this.$toast.success("Stock data removed", {
                dismissible: true
                });
            }
        },
        updateStock: async function() {
            await axios.get(`${process.env.VUE_APP_STOCKSCLIENTAPI}/${this.stock.ticker}/getdata`, {withCredentials: true})
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
                setTimeout(function(){ 
                    location.reload()
                }, 2400);       
                this.$toast.success(this.resp.data, {
                dismissible: true
                });
            }
        }
    }
}
</script>
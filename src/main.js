//npm install bootstrap jquery popper.js
//npm install lodash moment axios
//npm install @fortawesome/fontawesome-free @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
//npm install @fortawesome/vue-fontawesome@3.0.1
//npm install vue-router@4
//npm install @meforma/vue-toaster
//npm install stylus-loader@3 stylus
//npm i vue-chartjs chart.js
//npm install --save v-tooltip

import { createApp } from 'vue'
import store from './store.js'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faPlus, faMinus, faTrash, faCheck, faInfo, faCog, faWindowRestore} from '@fortawesome/free-solid-svg-icons';

import App from './App.vue'
import AppRouter from './router'

import Toaster from '@meforma/vue-toaster';
import VTooltip from 'v-tooltip'

library.add(faPlus, faMinus, faTrash, faCheck, faInfo, faCog, faWindowRestore)

createApp(App).use(AppRouter).use(store).use(VTooltip).use(Toaster).mount('#app')

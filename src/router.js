import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home'
import Stock from './components/Stock'
import StocksRatioList from './components/StocksRatioList'
import StocksDividendList from './components/StocksDividendList'
import Settings from './components/Settings'
import StocksCompareTable from './components/StocksCompareTable'
import StocksCompareGraph from './components/StocksCompareGraph'
import Login from './components/Login'
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/stocks/:ticker',
    name: 'stock',
    component: Stock
  },
  {
    path: '/stocks/ratio',
    name: 'stocksratio',
    component: StocksRatioList
  },
  {
    path: '/stocks/dividend',
    name: 'stocksdividend',
    component: StocksDividendList
  },
  {
    path: '/stocks/comparetable',
    name: 'stockscomparetable',
    component: StocksCompareTable
  },
  {
    path: '/stocks/comparegraph',
    name: 'stockscomparegraph',
    component: StocksCompareGraph
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/bodega',
    name: 'bodega',
    component: () => import('@/views/BodegaView.vue')
  },
  {
    path:'/cliente',
    name: 'cliente',
    component: () => import('@/views/ClienteView.vue')
  },
  {
    path:'/producto',
    name: 'producto',
    component: () => import('@/views/ProductoView.vue')
  },
  {
    path:'/factura',
    name: 'factura',
    component: () => import('@/views/FacturaView.vue')
  },
  {
    path:'/reporte-factura',
    name: 'reporteFactura',
    component: () => import('@/views/ReporteFacturaView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

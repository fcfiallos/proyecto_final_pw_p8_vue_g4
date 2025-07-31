import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiereAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/bodega',
    name: 'bodega',
    component: () => import('@/views/BodegaView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/cliente',
    name: 'cliente',
    component: () => import('@/views/ClienteView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/producto',
    name: 'producto',
    component: () => import('@/views/ProductoView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/factura',
    name: 'factura',
    component: () => import('@/views/FacturaView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/reporte-factura',
    name: 'reporteFactura',
    component: () => import('@/views/ReporteFacturaView.vue'),
    meta: { requiereAuth: true }
  },

  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {

  const necesitaAuth = to.meta.requiereAuth;
  console.log(`La ruta '${to.path}' necesita autenticación:`, necesitaAuth);

  const cedulaGuardada = localStorage.getItem('cedula_usuario');
  const estaLogueado = !!cedulaGuardada;
  console.log(`¿Usuario está logueado? (hay cédula guardada):`, estaLogueado, `(Valor: ${cedulaGuardada})`);

  if (necesitaAuth && !estaLogueado) {

    next({ name: 'login' });
  } else if (to.name === 'login' && estaLogueado) {

    next({ name: 'home' });
  } else {

    next();
  }
});



export default router
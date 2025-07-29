<template>
  <div class="row justify-content-center" v-if="!opcionSeleccionada">
    <div 
      v-for="carta in cartas" 
      :key="carta.titulo" 
      :class="[
        isFourOrLess ? 'col-lg-6 col-md-6' : 'col-lg-4 col-md-4',
        'col-sm-6 mb-3 mb-sm-4'
      ]">
      <div class="card">
        <div class="card-body">
          <i :class="carta.icono"></i>
          <h3>{{ carta.titulo }}</h3>
          <button @click="seleccionarOpcion(carta.redireccion || carta.valor)">
            {{ carta.boton }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OpcionesSeleccion',
  props: {
    cartas: {
      type: Array,
      required: true
    },
    opcionSeleccionada: {
      type: String,
      default: ''
    }
  },
  computed: {
    isFourOrLess() {
      return this.cartas.length >= 4;
    }
  },
  methods: {
    seleccionarOpcion(opcion) {
      this.$emit('opcion-seleccionada', opcion);
    }
  }
};
</script>

<style src="@/css/EstilosCards.css" scoped>
.row:only-child:has(> div:nth-last-child(-n+2):first-child) {
  justify-content: center;
}
</style>

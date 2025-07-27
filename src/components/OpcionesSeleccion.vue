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
      return this.cartas.length <= 4;
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
.card {
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
}

.card-body {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

.card-body i {
  font-size: 2rem;
  color: #4297b9;
  margin-bottom: 15px;
}

.card-body h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

button {
  background: #4297b9;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #3688a1;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .card {
    margin-bottom: 15px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  [class*="col-md"] {
    margin-bottom: 20px;
  }
}

/* Center the cards when there are only 2 in a row */
.row:only-child:has(> div:nth-last-child(-n+2):first-child) {
  justify-content: center;
}
</style>

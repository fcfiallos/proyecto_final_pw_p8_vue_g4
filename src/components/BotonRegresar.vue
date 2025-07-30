<template>
  <button @click="regresar" class="btn btn-secondary btn-regresar" :title="titulo">
    <i class="bi bi-arrow-left"></i> {{ texto }}
  </button>
</template>

<script>
export default {
  name: "BotonRegresar",
  props: {
    ruta: {
      type: String,
      required: false,
      default: null,
    },

    accion: {
      type: Function,
      required: false,
      default: null,
    },
   
    texto: {
      type: String,
      required: false,
      default: "Regresar",
    },

    titulo: {
      type: String,
      required: false,
      default: "Volver a la página anterior",
    },
  },
  methods: {
    regresar() {
      if (this.accion) {
      
        this.accion();
      } else if (this.ruta) {
       
        this.$router.push(this.ruta);
      } else {
       
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style scoped>
.btn-regresar {
  color: white;
  transition: all 0.3s ease;
}

.btn-regresar:hover {
  background-color: #eee !important;
  border: #6c757d 2px solid !important;
  color: #6c757d !important;
}

.btn-regresar i {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .btn-regresar {
    width: 100%;
    margin: 10px 0;
  }
}
</style>


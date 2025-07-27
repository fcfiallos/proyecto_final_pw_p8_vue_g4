<template>
  <div class="cliente container-fluid">
    <div class="header-container">
      <BotonRegresar
        :ruta="`/`"
        :texto="'Volver a Inicio'"
        class="boton-inicio"
      />
      <h1>Gestión de Clientes</h1>
    </div>
  </div>
</template>

<script>
import BotonRegresar from "@/components/BotonRegresar.vue";
export default {
  name: "ClienteView",
  components: {
    BotonRegresar,
  },
};
</script>

<style src="@/css/HeaderView.css" scoped>
.cliente {
  padding: 20px;
}
</style>
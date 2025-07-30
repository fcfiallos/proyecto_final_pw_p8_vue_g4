<template>
  <div class="cliente container-fluid">
    <div class="header-container">
      <BotonRegresar
        :ruta="`/`"
        :texto="'Volver a Inicio'"
        class="boton-inicio"
        :icono="'bi bi-house-door'"
      />
      <h1>Gestión de Clientes</h1>
    </div>
    <div></div>
  </div>
  <Cliente />
</template>

<script>
import BotonRegresar from "@/components/BotonRegresar.vue";
import Cliente from "@/components/Cliente.vue";
export default {
  name: "ClienteView",
  components: {
    BotonRegresar,
    Cliente,
  },
};
</script>

<style src="@/css/HeaderView.css" scoped>
.cliente {
  padding: 20px;
}
</style>
<template>
  <div class="factura container-fluid">
    <div class="header-container">
      <BotonRegresar
        :ruta="`/`"
        :texto="'Volver a Inicio'"
        class="boton-inicio"
      />
      <h1>Gestión de Facturas</h1>
    </div>
  </div>
</template>

<script>
import BotonRegresar from "@/components/BotonRegresar.vue";
export default {
  name: "FacturaView",
  components: {
    BotonRegresar,
  },
};
</script>

<style src="@/css/HeaderView.css" scoped>
.factura {
  padding: 20px;
}
</style>
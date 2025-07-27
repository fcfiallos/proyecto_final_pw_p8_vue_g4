<template>
  <div class="reporte-factura container-fluid">
    <div class="header-container">
      <BotonRegresar
        :ruta="`/`"
        :texto="'Volver a Inicio'"
        class="boton-inicio"
      />
      <h1>Reporte de Facturas</h1>
    </div>
  </div>
</template>

<script>
import BotonRegresar from "@/components/BotonRegresar.vue";
export default {
  name: "ReporteFacturaView",
  components: {
    BotonRegresar,
  },
};
</script>

<style src="@/css/HeaderView.css" scoped>
.reporte-factura {
  padding: 20px;
  margin: 20px;
}
</style>
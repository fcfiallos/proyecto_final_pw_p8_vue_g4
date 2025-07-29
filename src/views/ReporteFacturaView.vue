<template>
  <div class="reporte-factura container-fluid">
    <div class="header-container d-flex justify-content-between align-items-center mb-4">
      <BotonRegresar :ruta="'/'" :texto="'Volver a Inicio'" class="boton-inicio" />
      <h1 class="text-center">Reporte de Facturas</h1>
    </div>

    <ReporteFacturas />
  </div>
</template>

<script setup>
import BotonRegresar from "@/components/BotonRegresar.vue";
import ReporteFacturas from "@/components/ReporteFacturas.vue";
</script>

<style scoped>
.reporte-factura {
  padding: 20px;
  margin: 20px auto;
  max-width: 1000px;
}
</style>

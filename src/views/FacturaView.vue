<template>
  <div class="factura container-fluid">
    <div class="header-container">
      <BotonRegresar
        :ruta="`/`"
        :texto="'Volver a Inicio'"
        class="boton-inicio"
      />
    </div>
  </div>
  <Factura />
</template>

<script>
import BotonRegresar from "@/components/BotonRegresar.vue";
import Factura from "@/components/Factura.vue";
export default {
  name: "FacturaView",
  components: {
    BotonRegresar,
    Factura,
  },
};
</script>

<style src="@/css/HeaderView.css" scoped>
.factura {
  padding: 20px;
}
</style>
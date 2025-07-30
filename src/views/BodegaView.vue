<template>
  <div class="bodega container-fluid">
    <div class="header-container">
      <BotonRegresar
        :ruta="`/`"
        :texto="'Volver a Inicio'"
        class="boton-inicio"
        :icono="'bi bi-house-door'"
      />
      <h1>Gestión de Bodegas</h1>
    </div>
    <Bodega />
  </div>
</template>

<script>
import Bodega from "@/components/Bodega.vue";
import BotonRegresar from "@/components/BotonRegresar.vue";
export default {
  name: "BodegaView",
  components: {
    Bodega,
    BotonRegresar,
  },
};
</script>

<style src="@/css/HeaderView.css" scoped>
.bodega {
  padding: 20px;
}
</style>
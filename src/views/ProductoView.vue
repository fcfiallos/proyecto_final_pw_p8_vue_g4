<template>
  <div class="producto container-fluid">
    <div class="header-container">
      <BotonRegresar
        :ruta="`/`"
        :texto="'Volver a Inicio'"
        class="boton-inicio"
      />
      <h1>Gestión de Productos</h1>
    </div>
    <Producto />
  </div>
</template>

<script>
import Producto from "@/components/Producto.vue";
import BotonRegresar from "@/components/BotonRegresar.vue";
export default {
  name: "ProductoView",
  components: {
    Producto,
    BotonRegresar,
  },
};
</script>

<style src="@/css/HeaderView.css" scoped>
.producto {
  padding: 20px;
}
</style>
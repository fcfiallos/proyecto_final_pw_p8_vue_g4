<template>
  <div class="producto">
    <h1>Gestión de Productos</h1>
    <Producto />
  </div>
</template>

<script>
import Producto from "@/components/Producto.vue";
export default {
  name: "ProductoView",
  components: {
    Producto,
  },
};
</script>

<style scoped>
.producto {
  padding: 20px;
}
</style>
<template>
  <div class="bodega">
    <h1>Gestión de Bodegas</h1>
    <Bodega />
  </div>
</template>

<script>
import Bodega from "@/components/Bodega.vue";
export default {
  name: "BodegaView",
  components: {
    Bodega,
  },
};
</script>

<style scoped>
.bodega {
  padding: 20px;
}
</style>
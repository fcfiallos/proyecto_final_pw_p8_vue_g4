<template>
  <div>
    <div class="mb-4 mt-4">
      <label for="identificacion"><strong>Buscar por Identificación del Cliente:</strong></label>
      <input
        id="identificacion"
        v-model="filtroIdentificacion"
        placeholder="Ingrese identificación del cliente"
        class="form-control"
      />
    </div>

    <div v-if="facturasFiltradas.length > 0">
      <table class="table table-striped table-hover table-bordered">
        <thead class="thead-verde">
          <tr>
            <th># Documento</th>
            <th>Identificación Cliente</th>
            <th>Nombre Cliente</th>
            <th>Cantidad Ítems</th>
            <th>Total Impuestos</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="factura in facturasFiltradas" :key="factura.numeroDocumento">
            <td>{{ factura.numeroDocumento }}</td>
            <td>{{ factura.identificacionCliente }}</td>
            <td>{{ factura.nombreCliente }}</td>
            <td>{{ factura.cantidadItems }}</td>
            <td>${{ factura.totalImpuestos.toFixed(2) }}</td>
            <td>${{ factura.total.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <p class="text-muted">No se encontraron facturas con esa identificación.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { obtenerReporteFacturasFachada } from "@/client/FacturaClient.js";

const facturas = ref([]);
const filtroIdentificacion = ref("");

const facturasFiltradas = computed(() => {
  if (!filtroIdentificacion.value) return facturas.value;
  return facturas.value.filter((factura) =>
    factura.identificacionCliente
      .toLowerCase()
      .includes(filtroIdentificacion.value.toLowerCase())
  );
});

onMounted(async () => {
  try {
    facturas.value = await obtenerReporteFacturasFachada();
  } catch (error) {
    console.error("Error al cargar el reporte de facturas:", error);
  }
});


</script>

<style src="@/css/EstilosCrud.css">

input {
  margin-top: 10px;
  margin-bottom: 20px;
}

table {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden; 
  margin-top: 10px;
}

table th, table td {
  vertical-align: middle;
}

</style>

<template>
  <div class="container-fluid">
    <div class="row mb-4 mt-4">
      <label for="identificacion"
        ><strong>Buscar por Identificación del Cliente:</strong></label
      >
      <input
        id="identificacion"
        v-model="filtroIdentificacion"
        placeholder="Ingrese identificación del cliente"
        class="form-control"
        type="text"
        pattern="^[0-9]{10}$"
      />
    </div>

    <div class="row" v-if="facturasFiltradas.length > 0">
      <div class="col-12 table-responsive">
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
            <tr
              v-for="factura in facturasFiltradas"
              :key="factura.numeroDocumento"
            >
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
    </div>

    <div class="row" v-else>
      <div class="col-12">
        <p class="text-muted">
          No se encontraron facturas con esa identificación.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { obtenerReporteFacturasFachada } from "@/client/FacturaClient.js";

export default {
  name: "ReporteFacturas",
  data() {
    return {
      facturas: [],
      filtroIdentificacion: "",
    };
  },
  computed: {
    facturasFiltradas() {
      if (!this.filtroIdentificacion) return this.facturas;
      return this.facturas.filter((factura) =>
        factura.identificacionCliente
          .toLowerCase()
          .includes(this.filtroIdentificacion.toLowerCase())
      );
    },
  },
  async mounted() {
    try {
      this.facturas = await obtenerReporteFacturasFachada();
    } catch (error) {
      console.error("Error al cargar el reporte de facturas:", error);
    }
  },
};
</script>

<style src="@/css/EstilosCrud.css">
</style>

<style scoped>
input {
  margin-top: 10px;
  margin-bottom: 20px;
}

table {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 10px;
  width: 100%;
}

table th,
table td {
  vertical-align: middle;
}

@media (max-width: 768px) {
  .table-responsive {
    border: 0;
    overflow-x: auto;
  }
}
</style>

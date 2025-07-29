<template>
  <div class="impuestos-section container-fluid p-3">
    <div class="impuestos-disponibles">
      <h5 class="mb-3">Impuestos Disponibles</h5>
      <div class="loading text-center" v-if="cargando">
        <i class="bi bi-arrow-clockwise spinner-border-sm me-2"></i> Cargando impuestos...
      </div>
      <div v-else-if="impuestosDisponibles.length === 0" class="no-impuestos text-center p-4">
        <p>No hay impuestos registrados.</p>
        <button
          type="button"
          @click="mostrarFormulario = true"
          class="btn btn-success btn-gradient-success"
        >
          <i class="bi bi-plus"></i> Crear Primer Impuesto
        </button>
      </div>
      <div v-else class="row">
        <div
          v-for="impuesto in impuestosDisponibles"
          :key="impuesto.id"
          class="col"
        >
          <div class="card h-100 border-hover">
            <div class="card-body">
              <label class="d-flex align-items-center w-100 mb-0">
                <input
                  type="checkbox"
                  :value="impuesto.id"
                  v-model="impuestosSeleccionadosLocal"
                  @change="actualizarSeleccionados"
                  class="form-check-input me-3"
                />
                <div class="impuesto-info">
                  <strong>{{ impuesto.nombre }}</strong>
                  <span class="badge bg-light text-dark">{{ (impuesto.valor * 100).toFixed(2) }}%</span>
                  <small v-if="impuesto.descripcion" class="text-muted d-block mt-1">
                    {{ impuesto.descripcion }}
                  </small>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        @click="mostrarFormulario = !mostrarFormulario"
        class="btn btn-info text-white w-100 mt-3 btn-gradient-info"
        v-if="impuestosDisponibles.length > 0"
      >
        <i class="bi" :class="mostrarFormulario ? 'bi-dash' : 'bi-plus'"></i>
        {{ mostrarFormulario ? "Cancelar" : "Crear Nuevo Impuesto" }}
      </button>
    </div>

    <!-- Formulario para crear nuevo impuesto -->
    <div v-if="mostrarFormulario" class="formulario-impuesto card mt-4 border-primary">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Crear Nuevo Impuesto</h5>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="nuevoImpuestoNombre" class="form-label">Nombre</label>
          <input
            type="text"
            id="nuevoImpuestoNombre"
            v-model="nuevoImpuesto.nombre"
            placeholder="Ej: IVA, ICE, etc."
            maxlength="50"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <label for="nuevoImpuestoValor" class="form-label">Valor (%)</label>
          <input
            type="number"
            step="0.0001"
            min="0"
            max="100"
            id="nuevoImpuestoValor"
            v-model="nuevoImpuesto.valor"
            placeholder="Ej: 15.0000"
            class="form-control"
          />
          <small class="form-text text-muted">Ingrese el porcentaje (ej: 15 para 15%)</small>
        </div>
        <div class="mb-3">
          <label for="nuevoImpuestoDescripcion" class="form-label">Descripción (Opcional)</label>
          <textarea
            id="nuevoImpuestoDescripcion"
            v-model="nuevoImpuesto.descripcion"
            placeholder="Descripción del impuesto..."
            maxlength="200"
            rows="3"
            class="form-control"
          ></textarea>
        </div>
        <div class="d-flex gap-2">
          <button
            type="button"
            @click="crearImpuesto"
            class="btn btn-success flex-grow-1 btn-gradient-success"
          >
            <i class="bi bi-check"></i> Guardar
          </button>
          <button
            type="button"
            @click="cancelarCreacion"
            class="btn btn-danger flex-grow-1 btn-gradient-danger"
          >
            <i class="bi bi-x"></i> Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template><script>
import {
  obtenerTodosFachada,
  guardarFachada,
  eliminarFachada
} from "@/client/ImpuestoClient";

export default {
  name: "GeneradorImpuesto",
  props: {
    // Array de IDs de impuestos seleccionados desde el componente padre
    impuestosSeleccionados: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      impuestosDisponibles: [],
      impuestosSeleccionadosLocal: [], // Para manejo interno
      nuevoImpuesto: { nombre: "", valor: 0, descripcion: "" },
      mostrarFormulario: false,
      cargando: false,
      error: null
    };
  },
  watch: {
    impuestosSeleccionados: {
      handler(nuevosSeleccionados) {
        // Actualizar la selección local cuando cambia la propiedad
        this.impuestosSeleccionadosLocal = [...nuevosSeleccionados];
      },
      immediate: true
    }
  },
  methods: {
    // Cargar impuestos disponibles desde el backend
    async cargarImpuestosDisponibles() {
      this.cargando = true;
      try {
        this.impuestosDisponibles = await obtenerTodosFachada();
      } catch (error) {
        console.error("Error al cargar impuestos:", error);
        this.error = "Error al cargar los impuestos disponibles";
        this.$emit("error", "Error al cargar los impuestos disponibles");
      } finally {
        this.cargando = false;
      }
    },

    // Actualizar seleccionados en el componente padre
    actualizarSeleccionados() {
      this.$emit("update:impuestos-seleccionados", this.impuestosSeleccionadosLocal);
    },

    // Crear nuevo impuesto
    async crearImpuesto() {
      if (!this.nuevoImpuesto.nombre || !this.nuevoImpuesto.valor) {
        this.$emit("error-impuesto", "Nombre y valor son obligatorios para crear un impuesto");
        return;
      }

      if (
        parseFloat(this.nuevoImpuesto.valor) < 0 ||
        parseFloat(this.nuevoImpuesto.valor) > 100
      ) {
        this.$emit("error-impuesto", "El valor debe estar entre 0 y 100");
        return;
      }

      try {
        // Convertir el porcentaje a decimal para el backend (15% -> 0.15)
        const impuestoParaEnviar = {
          nombre: this.nuevoImpuesto.nombre.trim(),
          valor: parseFloat(this.nuevoImpuesto.valor) / 100,
          descripcion: this.nuevoImpuesto.descripcion
            ? this.nuevoImpuesto.descripcion.trim()
            : null,
        };

        await guardarFachada(impuestoParaEnviar);
        this.$emit("exito", "Impuesto creado exitosamente");
        this.nuevoImpuesto = { nombre: "", valor: 0, descripcion: "" };
        this.mostrarFormulario = false;

        // Recargar lista de impuestos disponibles
        await this.cargarImpuestosDisponibles();
      } catch (error) {
        console.error("Error al crear impuesto:", error);
        if (error.response && error.response.status === 409) {
          this.$emit("error-impuesto", "Ya existe un impuesto con ese nombre");
        } else if (error.response && error.response.status === 400) {
          this.$emit("error-impuesto", "Datos inválidos. Verifique el nombre y valor");
        } else {
          this.$emit("error", "Error al crear el impuesto");
        }
      }
    },

    // Cancelar creación de impuesto
    cancelarCreacion() {
      this.mostrarFormulario = false;
      this.nuevoImpuesto = { nombre: "", valor: 0, descripcion: "" };
      this.$emit("limpiar-mensajes");
    },

    // Obtener impuestos seleccionados como objetos completos
    obtenerImpuestosSeleccionadosCompletos() {
      return this.impuestosSeleccionadosLocal
        .map(impuestoId => {
          return this.impuestosDisponibles.find(imp => imp.id === impuestoId);
        })
        .filter(impuesto => impuesto !== undefined);
    }
  },
  async mounted() {
    await this.cargarImpuestosDisponibles();
  }
};
</script>

<style scoped>
/* Custom styles to enhance Bootstrap */
.impuestos-section {
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading i {
  animation: spin 1s linear infinite;
}

.border-hover {
  transition: all 0.3s ease;
  border: 1px solid #dee2e6;
}

.border-hover:hover {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.card-body {
  padding: 1rem;
}

/* Custom checkboxes */
.form-check-input {
  cursor: pointer;
  width: 1.2em;
  height: 1.2em;
}

.impuesto-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Button gradients */
.btn-gradient-success {
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
}

.btn-gradient-info {
  background: linear-gradient(45deg, #17a2b8, #6f42c1);
  border: none;
}

.btn-gradient-danger {
  background: linear-gradient(45deg, #dc3545, #c82333);
  border: none;
}

/* Button hover effects */
.btn-gradient-success:hover,
.btn-gradient-info:hover, 
.btn-gradient-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

/* Badge for tax value */
.badge {
  display: inline-block;
  margin-top: 4px;
  font-weight: normal;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .impuestos-section {
    padding: 15px 10px !important;
  }
  
  .card-body {
    padding: 0.75rem;
  }
}
</style>

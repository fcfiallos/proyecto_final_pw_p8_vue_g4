<template>
  <div class="impuestos-section">
    <div class="impuestos-disponibles">
      <h5>Impuestos Disponibles</h5>
      <div class="loading" v-if="cargando">
        <i class="bi bi-arrow-clockwise"></i> Cargando impuestos...
      </div>
      <div v-else-if="impuestosDisponibles.length === 0" class="no-impuestos">
        <p>No hay impuestos registrados.</p>
        <button
          type="button"
          @click="mostrarFormulario = true"
          class="btn-crear-impuesto"
        >
          <i class="bi bi-plus"></i> Crear Primer Impuesto
        </button>
      </div>
      <div v-else class="impuestos-grid">
        <div
          v-for="impuesto in impuestosDisponibles"
          :key="impuesto.id"
          class="impuesto-checkbox"
        >
          <label>
            <input
              type="checkbox"
              :value="impuesto.id"
              v-model="impuestosSeleccionadosLocal"
              @change="actualizarSeleccionados"
            />
            <span class="checkmark"></span>
            <div class="impuesto-info">
              <strong>{{ impuesto.nombre }}</strong>
              <span class="impuesto-valor">{{ (impuesto.valor * 100).toFixed(2) }}%</span>
              <small v-if="impuesto.descripcion" class="impuesto-descripcion">
                {{ impuesto.descripcion }}
              </small>
            </div>
          </label>
        </div>
      </div>
      <button
        type="button"
        @click="mostrarFormulario = !mostrarFormulario"
        class="btn-toggle-formulario"
        v-if="impuestosDisponibles.length > 0"
      >
        <i class="bi" :class="mostrarFormulario ? 'bi-dash' : 'bi-plus'"></i>
        {{ mostrarFormulario ? "Cancelar" : "Crear Nuevo Impuesto" }}
      </button>
    </div>

    <!-- Formulario para crear nuevo impuesto -->
    <div v-if="mostrarFormulario" class="formulario-impuesto">
      <h5>Crear Nuevo Impuesto</h5>
      <div class="form-group">
        <label for="nuevoImpuestoNombre">Nombre</label>
        <input
          type="text"
          id="nuevoImpuestoNombre"
          v-model="nuevoImpuesto.nombre"
          placeholder="Ej: IVA, ICE, etc."
          maxlength="50"
        />
      </div>
      <div class="form-group">
        <label for="nuevoImpuestoValor">Valor (%)</label>
        <input
          type="number"
          step="0.0001"
          min="0"
          max="100"
          id="nuevoImpuestoValor"
          v-model="nuevoImpuesto.valor"
          placeholder="Ej: 15.0000"
        />
        <small class="text-muted">Ingrese el porcentaje (ej: 15 para 15%)</small>
      </div>
      <div class="form-group">
        <label for="nuevoImpuestoDescripcion">Descripción (Opcional)</label>
        <textarea
          id="nuevoImpuestoDescripcion"
          v-model="nuevoImpuesto.descripcion"
          placeholder="Descripción del impuesto..."
          maxlength="200"
          rows="3"
        ></textarea>
      </div>
      <div class="botones-formulario">
        <button
          type="button"
          @click="crearImpuesto"
          class="btn-guardar-impuesto"
        >
          <i class="bi bi-check"></i> Guardar
        </button>
        <button
          type="button"
          @click="cancelarCreacion"
          class="btn-cancelar"
        >
          <i class="bi bi-x"></i> Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
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
/* Estilos para la sección de impuestos */
.impuestos-section {
  margin: 20px 0;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.impuestos-disponibles h5 {
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}

.loading i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.no-impuestos {
  text-align: center;
  padding: 20px;
  color: #666;
}

.btn-crear-impuesto {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-crear-impuesto:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.impuestos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.impuesto-checkbox {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: block;
}

.impuesto-checkbox:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.impuesto-checkbox label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.impuesto-checkbox input[type="checkbox"] {
  margin-right: 12px;
  transform: scale(1.2);
}

.impuesto-info {
  display: flex;
  flex-direction: column;
}

.impuesto-info strong {
  color: #333;
  font-size: 14px;
}

.impuesto-valor {
  color: #666;
  font-size: 12px;
  margin-top: 2px;
}

.impuesto-descripcion {
  display: block;
  color: #888;
  font-size: 11px;
  font-style: italic;
  margin-top: 2px;
}

.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  resize: vertical;
  font-family: inherit;
}

.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group .text-muted {
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
  display: block;
}

.btn-toggle-formulario {
  background: linear-gradient(45deg, #17a2b8, #6f42c1);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
}

.btn-toggle-formulario:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(23, 162, 184, 0.3);
}

.formulario-impuesto {
  background: white;
  border: 2px solid #007bff;
  border-radius: 10px;
  padding: 20px;
  margin-top: 15px;
}

.formulario-impuesto h5 {
  color: #007bff;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.botones-formulario {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-guardar-impuesto {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-guardar-impuesto:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-cancelar {
  background: linear-gradient(45deg, #dc3545, #c82333);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-cancelar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}
</style>

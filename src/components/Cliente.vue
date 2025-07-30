<template>
  <div class="container-cliente">
    <!-- 1. ENCABEZADO Y MENÚ DE OPCIONES -->
    <div class="header-container">
      <BotonRegresar :accion="regresarAOpciones" v-if="opcionSeleccionada" />
      <h2 v-if="!opcionSeleccionada">
        ¿Qué acción deseas realizar con los clientes?
      </h2>
    </div>
    <OpcionesSeleccion
      :cartas="cartasCliente"
      :opcion-seleccionada="opcionSeleccionada"
      @opcion-seleccionada="seleccionarOpcion"
    />

    <!-- 2. ÁREA DE MENSAJES PARA FEEDBACK AL USUARIO -->
    <div class="container-mensaje">
      <p v-if="exitoMensaje" id="exitoMensaje">
        <i class="bi bi-check-square"></i> {{ exitoMensaje }}
      </p>
      <p v-if="errorMensaje" id="errorMensaje">
        <i class="bi bi-exclamation-square"></i> {{ errorMensaje }}
      </p>
    </div>

    <!-- Formulario para CONSULTAR -->
    <div class="container-consultar" v-if="opcionSeleccionada === 'consultar'">
      <h3>Consultar Cliente por Cédula</h3>
      <input
        type="text"
        v-model="cliente.cedula"
        placeholder="Ingrese la cédula"
        @keyup.enter="consultar"
      />
      <button class="boton" @click="consultar">Consultar</button>
      <div class="resultado" v-if="resultadoConsulta">
        <p>
          <strong>Nombre:</strong> {{ resultadoConsulta.nombre }}
          {{ resultadoConsulta.apellido }}
        </p>
        <p><strong>Cédula:</strong> {{ resultadoConsulta.cedula }}</p>
        <p>
          <strong>Razón Social:</strong> {{ resultadoConsulta.razonSocial }}
        </p>
        <p><strong>Dirección:</strong> {{ resultadoConsulta.direccion }}</p>
        <p><strong>Teléfono:</strong> {{ resultadoConsulta.telefono }}</p>
        <p><strong>Email:</strong> {{ resultadoConsulta.email }}</p>
      </div>
    </div>

    <div class="container-guardar" v-if="opcionSeleccionada === 'guardar'">
      <h3>Crear Nuevo Cliente</h3>
      <div class="formulario">
        <label>Cédula</label>
        <input type="text" v-model="cliente.cedula" />
        <!-- Mensaje de validación para Cédula -->
        <span class="error-campo" v-if="mensajesValidacion.cedula">{{
          mensajesValidacion.cedula
        }}</span>

        <label>Nombre</label>
        <input type="text" v-model="cliente.nombre" />
        <!-- Mensaje de validación para Nombre -->
        <span class="error-campo" v-if="mensajesValidacion.nombre">{{
          mensajesValidacion.nombre
        }}</span>

        <label>Apellido</label>
        <input type="text" v-model="cliente.apellido" />
        <!-- Mensaje de validación para Apellido -->
        <span class="error-campo" v-if="mensajesValidacion.apellido">{{
          mensajesValidacion.apellido
        }}</span>

        <label>Razón Social</label>
        <input type="text" v-model="cliente.razonSocial" />
        <!-- Mensaje de validación para Razón Social (si lo necesitas) -->
        <span class="error-campo" v-if="mensajesValidacion.razonSocial">{{
          mensajesValidacion.razonSocial
        }}</span>

        <label>Dirección</label>
        <input type="text" v-model="cliente.direccion" />
        <!-- Mensaje de validación para Dirección -->
        <span class="error-campo" v-if="mensajesValidacion.direccion">{{
          mensajesValidacion.direccion
        }}</span>

        <label>Teléfono</label>
        <input type="text" v-model="cliente.telefono" />
        <!-- Mensaje de validación para Teléfono -->
        <span class="error-campo" v-if="mensajesValidacion.telefono">{{
          mensajesValidacion.telefono
        }}</span>

        <label>Email</label>
        <input type="email" v-model="cliente.email" />
        <!-- Mensaje de validación para Email -->
        <span class="error-campo" v-if="mensajesValidacion.email">{{
          mensajesValidacion.email
        }}</span>
      </div>
      <button class="boton" @click="guardar">Guardar Cliente</button>
    </div>
    <!-- Formulario para ACTUALIZAR -->
    <div
      class="container-actualizar"
      v-if="opcionSeleccionada === 'actualizar'"
    >
      <h3>Actualizar Cliente</h3>
      <p>1. Busque el cliente por su cédula:</p>
      <input
        type="text"
        v-model="cliente.cedula"
        placeholder="Cédula del cliente a modificar"
        @keyup.enter="consultar"
      />
      <button class="boton" @click="consultar">Buscar para Actualizar</button>

      <div class="formulario" v-if="resultadoConsulta">
        <p>2. Modifique los datos necesarios y confirme:</p>
        <label>Nombre</label>
        <input type="text" v-model="resultadoConsulta.nombre" />
        <label>Apellido</label>
        <input type="text" v-model="resultadoConsulta.apellido" />
        <label>Razón Social</label>
        <input type="text" v-model="resultadoConsulta.razonSocial" />
        <label>Dirección</label>
        <input type="text" v-model="resultadoConsulta.direccion" />
        <label>Teléfono</label>
        <input type="text" v-model="resultadoConsulta.telefono" />
        <label>Email</label>
        <input type="email" v-model="resultadoConsulta.email" />
        <button class="boton" @click="actualizar">
          Confirmar Actualización
        </button>
      </div>
    </div>

    <!-- Formulario para ELIMINAR -->
    <div class="container-eliminar" v-if="opcionSeleccionada === 'eliminar'">
      <h3>Eliminar Cliente por Cédula</h3>
      <input
        type="text"
        v-model="cliente.cedula"
        placeholder="Cédula del cliente a eliminar"
        @keyup.enter="eliminar"
      />
      <button class="boton-eliminar" @click="eliminar">Eliminar</button>
    </div>
  </div>

  <div class="container-facturas" v-if="opcionSeleccionada === 'facturas'">
    <!-- Formulario de Búsqueda Centrado -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="facturas-form-section">
          <h3 class="text-center mb-4">
            <i class="bi bi-receipt"></i> Consultar Facturas por Cédula
          </h3>
          <div class="form-group">
            <label for="cedula-facturas" class="form-label text-center d-block">
              <strong>Ingrese la Cédula del Cliente:</strong>
            </label>
            <input
              id="cedula-facturas"
              type="text"
              v-model="cliente.cedula"
              placeholder="Ej: 1722586890"
              class="form-control mb-3 text-center"
              @keyup.enter="consultarFacturas"
            />
            <button class="btn btn-success w-100" @click="consultarFacturas">
              <i class="bi bi-search"></i> Ver Facturas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Separador visual -->
    <hr class="my-5" v-if="listaFacturas && listaFacturas.length > 0" />

    <!-- Tabla de Resultados -->
    <div
      class="resultado-facturas"
      v-if="listaFacturas && listaFacturas.length > 0"
    >
      <h4 class="mb-4 text-center">
        <i class="bi bi-receipt-cutoff"></i> Facturas Encontradas
      </h4>
      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th># Documento</th>
              <th>Nombre Cliente</th>
              <th>Total Impuestos</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="factura in listaFacturas" :key="factura.numeroDocumento">
              <td>{{ factura.numeroDocumento }}</td>
              <td>{{ factura.nombreCliente }}</td>
              <td>${{ factura.totalImpuestos.toFixed(2) }}</td>
              <td class="fw-bold">${{ factura.total.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// Importamos los componentes hijos y la fachada del cliente
import BotonRegresar from "@/components/BotonRegresar.vue";
import OpcionesSeleccion from "@/components/OpcionesSeleccion.vue";
import {
  guardarClienteFachada,
  consultarClientePorCedulaFachada,
  actualizarClienteFachada,
  eliminarClientePorCedulaFachada,
} from "@/client/ClienteClient";
import { obtenerReporteFacturasPorCedulaFachada } from "@/client/FacturaClient.js";

export default {
  name: "GestionCliente",
  components: {
    BotonRegresar,
    OpcionesSeleccion,
  },
  data() {
    return {
      opcionSeleccionada: "",
      cartasCliente: [
        {
          titulo: "Consultar Cliente",
          boton: "Consultar",
          valor: "consultar",
          icono: "bi bi-search",
        },
        {
          titulo: "Crear Cliente",
          boton: "Crear",
          valor: "guardar",
          icono: "bi bi-plus-circle",
        },
        {
          titulo: "Actualizar Cliente",
          boton: "Actualizar",
          valor: "actualizar",
          icono: "bi bi-pencil-square",
        },
        {
          titulo: "Eliminar Cliente",
          boton: "Eliminar",
          valor: "eliminar",
          icono: "bi bi-trash",
        },
        {
          titulo: "Ver Facturas Por Cliente",
          boton: "Ver Facturas",
          valor: "facturas",
          icono: "bi bi-receipt",
        },
      ],
      cliente: {
        cedula: "",
        nombre: "",
        apellido: "",
        razonSocial: "",
        direccion: "",
        telefono: "",
        email: "",
      },
      mensajesValidacion: {
        cedula: "",
        nombre: "",
        apellido: "",
        razonSocial: "",
        direccion: "",
        telefono: "",
        email: "",
      },
      resultadoConsulta: null,
      exitoMensaje: null,
      errorMensaje: null,
      listaFacturas: [],
    };
  },
  methods: {
    // Métodos para manejar la UI
    seleccionarOpcion(opcion) {
      this.opcionSeleccionada = opcion;
      this.limpiarTodo();
    },
    regresarAOpciones() {
      this.opcionSeleccionada = "";
      this.limpiarTodo();
    },
    limpiarTodo() {
      const cedulaActual = this.cliente.cedula;
      this.cliente = {
        cedula: cedulaActual,
        nombre: "",
        apellido: "",
        razonSocial: "",
        direccion: "",
        telefono: "",
        email: "",
      };
      this.resultadoConsulta = null;
    },
    async consultar() {
      this.exitoMensaje = null;
      this.errorMensaje = null;
      this.limpiarMensajesValidacion();

      if (!this.cliente.cedula) {
        this.errorMensaje = "La cédula es requerida.";
        return;
      }
      if (!/^[0-9]+$/.test(this.cliente.cedula)) {
        this.errorMensaje = "La cédula solo debe contener números.";
        return;
      }
      if (this.cliente.cedula.length !== 10) {
        this.errorMensaje = "La cédula debe tener exactamente 10 dígitos.";
        return;
      }

      try {
        const data = await consultarClientePorCedulaFachada(
          this.cliente.cedula
        );
        this.resultadoConsulta = data;

        if (data) {
          this.exitoMensaje = `Cliente encontrado: ${data.nombre} ${data.apellido}`;
          this.$nextTick(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
          setTimeout(() => {
            this.exitoMensaje = null;
          }, 3000);
        } else {
          this.errorMensaje = "No se encontró ningún cliente con esa cédula.";
          this.resultadoConsulta = null;
          this.$nextTick(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
          setTimeout(() => {
            this.errorMensaje = null;
          }, 3000);
          return;
        }
      } catch (error) {
        this.errorMensaje =
          "Error al consultar: " +
          (error.response?.data || "Ocurrió un problema en el servidor.");
        console.error("Error al consultar cliente:", error);
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
    limpiarMensajesValidacion() {
      this.mensajesValidacion = {
        cedula: "",
        nombre: "",
        apellido: "",
        razonSocial: "",
        direccion: "",
        telefono: "",
        email: "",
      };
    },
    async guardar() {
      this.exitoMensaje = null;
      this.errorMensaje = null;
      this.limpiarMensajesValidacion();

      let hayErrores = false;

      // Validación para Cédula
      const cedulaStr = String(this.cliente.cedula || "").trim();
      if (cedulaStr === "") {
        this.mensajesValidacion.cedula = "La cédula es obligatoria.";
        hayErrores = true;
      } else if (!/^[0-9]+$/.test(cedulaStr)) {
        this.mensajesValidacion.cedula =
          "La cédula solo debe contener números.";
        hayErrores = true;
      } else if (cedulaStr.length !== 10) {
        this.mensajesValidacion.cedula =
          "La cédula debe tener exactamente 10 dígitos.";
        hayErrores = true;
      }

      // Validación para Nombre
      if (!this.cliente.nombre || this.cliente.nombre.trim() === "") {
        this.mensajesValidacion.nombre = "El nombre es obligatorio.";
        hayErrores = true;
      }

      // Validación para Apellido
      if (!this.cliente.apellido || this.cliente.apellido.trim() === "") {
        this.mensajesValidacion.apellido = "El apellido es obligatorio.";
        hayErrores = true;
      }
      // Validación para Dirección
      if (!this.cliente.direccion || this.cliente.direccion.trim() === "") {
        this.mensajesValidacion.direccion = "La dirección es obligatoria.";
        hayErrores = true;
      }

      const telefonoStr = String(this.cliente.telefono || "").trim();
      if (telefonoStr === "") {
        this.mensajesValidacion.telefono = "El teléfono es obligatorio.";
        hayErrores = true;
      } else if (!/^[0-9]+$/.test(telefonoStr)) {
        // Verificamos que solo contenga números
        this.mensajesValidacion.telefono =
          "El teléfono solo debe contener números.";
        hayErrores = true;
      } else if (telefonoStr.length !== 10) {
        // Verificamos que la longitud sea exactamente 10
        this.mensajesValidacion.telefono =
          "El teléfono debe tener exactamente 10 dígitos.";
        hayErrores = true;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.cliente.email || this.cliente.email.trim() === "") {
        this.mensajesValidacion.email = "El email es obligatorio.";
        hayErrores = true;
      } else if (!emailRegex.test(this.cliente.email)) {
        this.mensajesValidacion.email = "El formato del email no es válido.";
        hayErrores = true;
      }

      if (hayErrores) {
        return;
      }

      try {
        await guardarClienteFachada(this.cliente);
        this.exitoMensaje = `Cliente '${this.cliente.nombre} ${this.cliente.apellido}' ha sido guardado.`;
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        this.limpiarTodo();
        setTimeout(() => {
          this.exitoMensaje = null;
        }, 3000);
      } catch (error) {
        this.errorMensaje =
          "Error al guardar: " +
          (error.response?.data || "Ocurrió un problema en el servidor.");
        console.error("Error al guardar cliente:", error);
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
    async actualizar() {
      try {
        await actualizarClienteFachada(
          this.cliente.cedula,
          this.resultadoConsulta
        );
        this.exitoMensaje = `Cliente con cédula ${this.cliente.cedula} ha sido actualizado.`;
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        this.limpiarTodo();
        setTimeout(() => {
          this.exitoMensaje = null;
        }, 3000);
      } catch (error) {
        this.errorMensaje =
          "Error: " +
          (error.response?.data || "No se pudo actualizar el cliente.");
        console.error("Error al actualizar cliente:", error);
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
    async eliminar() {
      if (!this.cliente.cedula) {
        this.errorMensaje = "La cédula es requerida.";
        return;
      }

      this.limpiarTodo();
      try {
        await eliminarClientePorCedulaFachada(this.cliente.cedula);
        this.exitoMensaje = "Cliente eliminado exitosamente.";
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.exitoMensaje = null;
        }, 3000);
      } catch (error) {
        this.errorMensaje =
          "Error: " +
          (error.response?.data || "No se pudo eliminar el cliente.");
        console.error("Error al eliminar cliente:", error);
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
    async consultarFacturas() {
      // Limpiamos resultados anteriores para evitar confusiones
      this.exitoMensaje = null;
      this.errorMensaje = null;
      this.listaFacturas = [];

      if (!this.cliente.cedula) {
        this.errorMensaje = "La cédula es requerida para buscar facturas.";
        return;
      }
      try {
        // Usamos la fachada del reporte de facturas
        const data = await obtenerReporteFacturasPorCedulaFachada(
          this.cliente.cedula
        );

        this.listaFacturas = data;

        if (data && data.length > 0) {
          this.exitoMensaje = `Se encontraron ${data.length} facturas para el cliente.`;
          setTimeout(() => {
            this.exitoMensaje = null;
          }, 3000);
        } else {
          this.exitoMensaje = "El cliente no tiene facturas registradas.";
          setTimeout(() => {
            this.exitoMensaje = null;
          }, 3000);
        }
      } catch (error) {
        this.errorMensaje =
          "Error: " +
          (error.response?.data || "No se pudo consultar las facturas.");
        console.error("Error al consultar facturas:", error);
        setTimeout(() => {
          this.errorMensaje = null;
        }, 3000);
      }
    },
    calcularTotalGeneral() {
      return this.listaFacturas.reduce(
        (total, factura) => total + factura.total,
        0
      );
    },
  },
};
</script>

<style src="@/css/EstilosCrud.css" scoped>

.resultado {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.error-campo {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 4px;
  display: block;
}

.container-facturas {
  width: 100%;
  margin-top: 2rem;
}

.facturas-form-section {
  background-color: #f8f9fa; /* Un gris muy claro */
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-container-centrado {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.form-container-centrado h3 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 25px;
}

.form-centrado {
  max-width: 450px;
  width: 100%;
  padding: 0;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  display: block;
}

.form-control {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
}

.form-control:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 0.2rem rgba(66, 185, 131, 0.25);
  transform: translateY(-1px);
}

.btn-success {
  background-color: #42b983;
  border-color: #42b983;
  padding: 12px 20px;
  font-weight: 600;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
  width: 100%;
  max-width: 100%;
}

.btn-success:hover {
  background-color: #369870;
  border-color: #369870;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.btn-success:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(66, 185, 131, 0.3);
}

.separador-facturas {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4297b9, transparent);
  margin: 30px 0;
  opacity: 0.6;
}

.resultado-facturas {
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.resultado-facturas h4 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 20px;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  padding: 15px 12px;
}

.table tbody td {
  padding: 12px;
  vertical-align: middle;
  border-color: #e9ecef;
}

.table-row-hover:hover {
  background-color: #e3f2fd !important;
  transition: background-color 0.2s ease;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.card-body h6 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.card-body h4 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

@media (max-width: 768px) {
  .facturas-form-section {
    padding: 20px 15px;
    margin-bottom: 15px;
    width: 95%;
    max-width: 500px;
  }

  .form-centrado {
    max-width: 100%;
    padding: 0;
  }

  .form-container-centrado h3 {
    font-size: 1.3rem;
  }

  .form-control {
    font-size: 0.9rem;
    padding: 10px 12px;
  }

  .btn-success {
    font-size: 0.9rem;
    padding: 10px 16px;
  }

  .separador-facturas {
    margin: 20px 0;
  }

  .resultado-facturas {
    padding: 15px;
    margin-top: 15px;
    width: 98%;
  }

  .table thead th {
    font-size: 0.75rem;
    padding: 10px 8px;
  }

  .table tbody td {
    font-size: 0.875rem;
    padding: 10px 8px;
  }

  .card-body h4 {
    font-size: 1.5rem;
  }

  .card-body h6 {
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .facturas-form-section {
    padding: 15px 10px;
    width: 98%;
    max-width: none;
  }

  .form-centrado {
    padding: 0;
  }

  .form-container-centrado h3 {
    font-size: 1.1rem;
  }

  .form-label {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .form-control {
    font-size: 0.85rem;
    padding: 8px 10px;
  }

  .btn-success {
    font-size: 0.85rem;
    padding: 8px 12px;
  }

  .resultado-facturas {
    width: 100%;
    margin: 15px 0;
  }

  .resultado-facturas h4 {
    font-size: 1.25rem;
  }

  .table thead th,
  .table tbody td {
    font-size: 0.75rem;
    padding: 8px 6px;
  }

  .card-body {
    padding: 15px;
  }

  .card-body h4 {
    font-size: 1.25rem;
  }
}

/* Animaciones suaves */
.table-responsive {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
hr {
  border: none;
  height: 1px;
  background-color: #e0e0e0;
}
</style>
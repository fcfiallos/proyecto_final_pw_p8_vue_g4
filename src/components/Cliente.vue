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
      <p v-if="exitoMensaje" class="exitoMensaje">
        <i class="bi bi-check-square"></i> {{ exitoMensaje }}
      </p>
      <p v-if="errorMensaje" class="errorMensaje">
        <i class="bi bi-exclamation-square"></i> {{ errorMensaje }}
      </p>
    </div>

    <!-- 3. FORMULARIOS DINÁMICOS BASADOS EN LA OPCIÓN SELECCIONADA -->

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
    <h3>Consultar Facturas por Cédula</h3>
    <input
      type="text"
      v-model="cliente.cedula"
      placeholder="Ingrese la cédula del cliente"
      @keyup.enter="consultarFacturas"
    />
    <button class="boton" @click="consultarFacturas">Ver Facturas</button>

    <!-- Tabla para mostrar los resultados -->
    <div class="resultado" v-if="listaFacturas && listaFacturas.length > 0">
      <h4>Facturas Encontradas:</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Número de Documento</th>
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
            <td>${{ factura.total.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
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
      this.exitoMensaje = null;
      this.errorMensaje = null;
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
        // ¡CORRECCIÓN! Asignamos el error al campo específico.
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

        this.cliente = {
          cedula: "",
          nombre: "",
          apellido: "",
          razonSocial: "",
          direccion: "",
          telefono: "",
          email: "",
        };
      } catch (error) {
        this.errorMensaje =
          "Error al guardar: " +
          (error.response?.data || "Ocurrió un problema en el servidor.");
      }
    },
    async actualizar() {
      try {
        await actualizarClienteFachada(
          this.cliente.cedula,
          this.resultadoConsulta
        );
        this.exitoMensaje = `Cliente con cédula ${this.cliente.cedula} ha sido actualizado.`;
        this.regresarAOpciones();
      } catch (error) {
        this.errorMensaje =
          "Error: " +
          (error.response?.data || "No se pudo actualizar el cliente.");
      }
    },
    async eliminar() {
      if (!this.cliente.cedula) {
        this.errorMensaje = "La cédula es requerida.";
        return;
      }
      if (
        !confirm(
          `¿Está seguro de eliminar al cliente con cédula ${this.cliente.cedula}?`
        )
      )
        return;

      this.limpiarTodo();
      try {
        await eliminarClientePorCedulaFachada(this.cliente.cedula);
        this.exitoMensaje = "Cliente eliminado exitosamente.";
      } catch (error) {
        this.errorMensaje =
          "Error: " +
          (error.response?.data || "No se pudo eliminar el cliente.");
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
        } else {
          this.exitoMensaje = "El cliente no tiene facturas registradas.";
        }
      } catch (error) {
        this.errorMensaje =
          "Error: " +
          (error.response?.data || "No se pudo consultar las facturas.");
      }
    },
  },
};
</script>

<style src="@/css/EstilosCrud.css" scoped>
.boton-eliminar {
  background-color: #dc3545;
}
.boton-eliminar:hover {
  background-color: #c82333;
}
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
</style>